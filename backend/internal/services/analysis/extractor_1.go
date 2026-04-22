package services

import (
	"archive/zip"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"

	"github.com/google/uuid"
)

type ProgressCallback func(ProgressEvent)

type ProgressEvent struct {
	Type     string      `json:"type"`
	Progress int         `json:"progress"`
	Message  string      `json:"message"`
	Result   interface{} `json:"result,omitempty"`
	Error    string      `json:"error,omitempty"`
}

func NewProgressEvent(progress int, message string) ProgressEvent {
	return ProgressEvent{
		Type:     "progress",
		Progress: progress,
		Message:  message,
	}
}

func NewDoneEvent(result interface{}) ProgressEvent {
	return ProgressEvent{
		Type:   "done",
		Result: result,
	}
}

func NewErrorEvent(err string) ProgressEvent {
	return ProgressEvent{
		Type:  "error",
		Error: err,
	}
}

var ignoredDirs = map[string]bool{
	"node_modules": true,
	".git":         true,
	"vendor":       true,
	"dist":         true,
	"build":        true,
	"__pycache__":  true,
	".next":        true,
	".nuxt":        true,
	"coverage":     true,
	".cache":       true,
	"target":       true,
	"bin":          true,
	"obj":          true,
	".exe":         true,
	".scr":         true,
	".msi":         true,
	".img":         true,
	".iso":         true,
	".xlsm":        true,
	".hta":         true,
}

var ignoredPatterns = []string{
	"*.min.js",
	"*.min.css",
	".DS_Store",
	"Thumbs.db",
	"*.log",
}

var codeExtensions = map[string]bool{
	".go":    true,
	".ts":    true,
	".tsx":   true,
	".js":    true,
	".jsx":   true,
	".py":    true,
	".rb":    true,
	".java":  true,
	".c":     true,
	".cpp":   true,
	".h":     true,
	".cs":    true,
	".rs":    true,
	".swift": true,
	".kt":    true,
}

var includeExtensions = map[string]bool{
	".md":   true,
	".json": true,
	".yaml": true,
	".yml":  true,
	".toml": true,
	".xml":  true,
	".sql":  true,
	".sh":   true,
	".bash": true,
}

var extensionToLanguage = map[string]string{
	".go":    "Go",
	".ts":    "TypeScript",
	".tsx":   "TypeScript",
	".js":    "JavaScript",
	".jsx":   "JavaScript",
	".py":    "Python",
	".java":  "Java",
	".rs":    "Rust",
	".cs":    "C#",
	".cpp":   "C++",
	".rb":    "Ruby",
	".swift": "Swift",
	".kt":    "Kotlin",
}

// Archivos clave que siempre deben incluirse
var alwaysInclude = map[string]bool{
	"package.json":        true,
	"package-lock.json":   true,
	"yarn.lock":           true,
	"pnpm-lock.yaml":      true,
	"go.mod":              true,
	"go.sum":              true,
	"Cargo.toml":          true,
	"requirements.txt":    true,
	"README.md":           true,
	"README":              true,
	"Dockerfile":          true,
	"docker-compose.yml":  true,
	"docker-compose.yaml": true,
	"tsconfig.json":       true,
}

type Metrics struct {
	Languages  map[string]int `json:"languages"`
	TotalFiles int            `json:"total_files"`
	TotalLines int            `json:"total_lines"`
	HasReadme  bool           `json:"has_readme"`
	HasDocker  bool           `json:"has_docker"`
	HasCI      bool           `json:"has_ci"`
	KeyDeps    []string       `json:"key_deps"`
}

type ExtractorService struct{}

type FileInfo struct {
	RelativePath  string   `json:"relative_path"`
	Extension     string   `json:"extension"`
	TotalLines    int      `json:"total_lines"`
	First60Lines  string   `json:"first_60_lines"`
	ExportedFuncs []string `json:"exported_funcs"`
	IsCode        bool     `json:"is_code"`
	IsConfig      bool     `json:"is_config"`
}

type ExtractionResult struct {
	Files   []FileInfo   `json:"files"`
	Tree    []string     `json:"tree"`
	Summary *SummaryInfo `json:"summary"`
}

type SummaryInfo struct {
	TotalFiles  int            `json:"total_files"`
	CodeFiles   int            `json:"code_files"`
	ConfigFiles int            `json:"config_files"`
	TotalLines  int            `json:"total_lines"`
	TotalChars  int            `json:"total_chars"`
	Extensions  map[string]int `json:"extensions"`
	Languages   map[string]int `json:"languages"`
}

func NewExtractorService() *ExtractorService {
	return &ExtractorService{}
}

func (s *ExtractorService) ExtractAndAnalyze(zipPath, filename, userID string, onProgress ProgressCallback) *AnalysisResultResponse {
	if onProgress != nil {
		onProgress(NewProgressEvent(0, "Iniciando extracción..."))
	}

	tempDir, err := os.MkdirTemp("", "extract-*")
	if err != nil {
		if onProgress != nil {
			onProgress(NewErrorEvent(fmt.Sprintf("Error creando directorio temporal: %v", err)))
		}
		return &AnalysisResultResponse{Title: fmt.Sprintf("Error: %v", err)}
	}
	defer os.RemoveAll(tempDir)

	if onProgress != nil {
		onProgress(NewProgressEvent(10, "Descomprimiendo archivo..."))
	}

	if err := unzip(zipPath, tempDir); err != nil {
		if onProgress != nil {
			onProgress(NewErrorEvent(fmt.Sprintf("Error descomprimiendo: %v", err)))
		}
		return &AnalysisResultResponse{Title: fmt.Sprintf("Error: %v", err)}
	}

	if onProgress != nil {
		onProgress(NewProgressEvent(30, "Analizando archivos..."))
	}

	files, tree, summary := s.extractFiles(tempDir, onProgress)

	fileTree := buildFileTree(files)
	metrics := buildMetrics(files)
	keyFiles := selectKeyFiles(files)

	fmt.Println("FILE TREE: ", fileTree)

	result := &AnalysisResultResponse{
		ID:             uuid.New().String(),
		Filename:       filename,
		Title:          "Project evaluation pending",
		Dimensions:     map[string]float64{},
		Analysis:       "Análisis en progreso...",
		Improvements:   []string{},
		CreatedAt:      time.Now().Format(time.RFC3339),
		ExtractedFiles: files,
		Tree:           tree,
		Summary:        summary,
		FileTree:       fileTree,
		KeyFiles:       keyFiles,
		Metrics:        metrics,
	}

	if onProgress != nil {
		onProgress(NewProgressEvent(90, "Finalizando..."))
		onProgress(NewDoneEvent(result))
	}

	return result
}

func (s *ExtractorService) extractFiles(baseDir string, onProgress ProgressCallback) ([]FileInfo, []string, *SummaryInfo) {
	var files []FileInfo
	var tree []string
	summary := &SummaryInfo{
		Extensions: make(map[string]int),
		Languages:  make(map[string]int),
	}

	// First pass: count total files for progress calculation
	totalFiles := 0
	filepath.Walk(baseDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return nil
		}
		if !info.IsDir() {
			relPath, err := filepath.Rel(baseDir, path)
			if err == nil {
				ext := strings.ToLower(filepath.Ext(relPath))
				if codeExtensions[ext] || includeExtensions[ext] {
					totalFiles++
				}
			}
		}
		return nil
	})

	processedFiles := 0

	filepath.Walk(baseDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return nil
		}

		relPath, err := filepath.Rel(baseDir, path)
		if err != nil {
			return nil
		}

		if info.IsDir() {
			if ignoredDirs[info.Name()] {
				return filepath.SkipDir
			}
			tree = append(tree, relPath)
			return nil
		}

		if ignoredDirs[filepath.Dir(relPath)] {
			return nil
		}

		for _, pattern := range ignoredPatterns {
			if matchPattern(info.Name(), pattern) {
				return nil
			}
		}

		ext := strings.ToLower(filepath.Ext(relPath))

		if !codeExtensions[ext] && !includeExtensions[ext] {
			return nil
		}

		isCode := codeExtensions[ext]
		isConfig := includeExtensions[ext] && !isCode

		fileInfo := FileInfo{
			RelativePath: relPath,
			Extension:    ext,
			IsCode:       isCode,
			IsConfig:     isConfig,
		}

		if isCode || isConfig {
			content, totalLines, first60, funcs := s.extractContent(path, isCode)
			fileInfo.TotalLines = totalLines
			fileInfo.First60Lines = first60
			fileInfo.ExportedFuncs = funcs
			summary.TotalChars += len(content)
		}

		files = append(files, fileInfo)
		tree = append(tree, relPath)

		summary.TotalFiles++
		if isCode {
			summary.CodeFiles++
		}
		if isConfig {
			summary.ConfigFiles++
		}
		summary.TotalLines += fileInfo.TotalLines
		summary.Extensions[ext]++
		summary.Languages[ext]++

		// Report progress
		processedFiles++
		if onProgress != nil && totalFiles > 0 {
			progress := 30 + (processedFiles * 50 / totalFiles)
			onProgress(NewProgressEvent(progress, fmt.Sprintf("Procesando archivo %d/%d...", processedFiles, totalFiles)))
		}

		return nil
	})

	return files, tree, summary
}

func (s *ExtractorService) extractContent(path string, isCode bool) (content string, totalLines int, first60 string, funcs []string) {
	data, err := os.ReadFile(path)
	if err != nil {
		return "", 0, "", nil
	}

	content = string(data)
	lines := strings.Split(content, "\n")
	totalLines = len(lines)

	if len(lines) > 60 {
		first60 = strings.Join(lines[:60], "\n")
	} else {
		first60 = content
	}

	if isCode {
		funcs = extractExportedFunctions(content)
	}

	return content, totalLines, first60, funcs
}

func extractExportedFunctions(content string) []string {
	var funcs []string
	lines := strings.Split(content, "\n")

	for _, line := range lines {
		line = strings.TrimSpace(line)
		if strings.HasPrefix(line, "func ") && len(line) > 5 {
			name := strings.TrimPrefix(line, "func ")
			name = strings.TrimPrefix(name, "func ")
			if len(name) > 0 && (name[0] >= 'A' && name[0] <= 'Z') {
				funcs = append(funcs, name)
			}
		}
		if strings.HasPrefix(line, "export function ") {
			parts := strings.Fields(line)
			if len(parts) >= 3 {
				funcs = append(funcs, parts[2])
			}
		}
		if strings.HasPrefix(line, "export const ") || strings.HasPrefix(line, "export let ") {
			parts := strings.Fields(line)
			if len(parts) >= 3 {
				funcs = append(funcs, parts[2])
			}
		}
	}

	return funcs
}

func matchPattern(name, pattern string) bool {
	if strings.HasPrefix(pattern, "*.") {
		ext := strings.TrimPrefix(pattern, "*.")
		return strings.HasSuffix(name, ext)
	}
	return name == pattern
}

func unzip(src, dest string) error {
	r, err := zip.OpenReader(src)
	if err != nil {
		return err
	}
	defer r.Close()

	for _, file := range r.File {
		path := filepath.Join(dest, file.Name)

		if file.FileInfo().IsDir() {
			os.MkdirAll(path, 0755)
			continue
		}

		if err := os.MkdirAll(filepath.Dir(path), 0755); err != nil {
			return err
		}

		outFile, err := os.OpenFile(path, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, 0644)
		if err != nil {
			return err
		}

		rc, err := file.Open()
		if err != nil {
			outFile.Close()
			return err
		}

		_, err = io.Copy(outFile, rc)
		rc.Close()
		outFile.Close()

		if err != nil {
			return err
		}
	}

	return nil
}

func buildFileTree(files []FileInfo) string {
	if len(files) == 0 {
		return ""
	}

	dirs := make(map[string][]FileInfo)
	var allDirs []string
	dirExists := make(map[string]bool)

	for _, f := range files {
		dir := filepath.Dir(f.RelativePath)
		if dir == "." {
			dir = ""
		}
		if !dirExists[dir] {
			dirExists[dir] = true
			allDirs = append(allDirs, dir)
		}
		dirs[dir] = append(dirs[dir], f)
	}

	var sb strings.Builder
	sb.WriteString("ESTRUCTURA DEL PROYECTO:\n")

	sort.Strings(allDirs)

	var rootFiles []FileInfo
	var subdirs []string

	for _, f := range files {
		if filepath.Dir(f.RelativePath) == "." || filepath.Dir(f.RelativePath) == "" {
			rootFiles = append(rootFiles, f)
		} else {
			parentDir := filepath.Dir(f.RelativePath)
			if parentDir != "." && parentDir != "" {
				isSubdir := false
				for _, s := range subdirs {
					if s == parentDir {
						isSubdir = true
						break
					}
				}
				if !isSubdir {
					subdirs = append(subdirs, parentDir)
				}
			}
		}
	}

	writeFiles(&sb, rootFiles, 0, true)

	sort.Strings(subdirs)
	for _, dir := range subdirs {
		dirName := filepath.Base(dir)
		sb.WriteString(fmt.Sprintf("%s/\n", dirName))
		dirFiles := dirs[dir]
		writeFiles(&sb, dirFiles, 1, len(dirFiles) == 0)

		subDirsInDir := getSubdirs(dir, dirs)
		for _, sub := range subDirsInDir {
			writeSubdir(&sb, sub, 1)
			subFiles := dirs[sub]
			writeFiles(&sb, subFiles, 2, true)
		}
	}

	return sb.String()
}

func getSubdirs(parent string, dirs map[string][]FileInfo) []string {
	var result []string
	for d := range dirs {
		if filepath.Dir(d) == parent {
			result = append(result, d)
		}
	}
	sort.Strings(result)
	return result
}

func writeSubdir(sb *strings.Builder, dir string, depth int) {
	indent := strings.Repeat("    ", depth)
	name := filepath.Base(dir)
	sb.WriteString(fmt.Sprintf("%s%s/\n", indent, name))
}

func writeFiles(sb *strings.Builder, files []FileInfo, depth int, isLast bool) {
	if len(files) == 0 {
		return
	}

	sort.Slice(files, func(i, j int) bool {
		return files[i].RelativePath < files[j].RelativePath
	})

	for i, f := range files {
		indent := strings.Repeat("    ", depth)
		prefix := "├── "
		if i == len(files)-1 {
			prefix = "└── "
		}
		name := filepath.Base(f.RelativePath)
		sb.WriteString(fmt.Sprintf("%s%s%s (%d líneas)\n", indent, prefix, name, f.TotalLines))
	}
}

func buildMetrics(files []FileInfo) *Metrics {
	metrics := &Metrics{
		Languages:  make(map[string]int),
		KeyDeps:    []string{},
		TotalFiles: len(files),
	}

	linesByLang := make(map[string]int)

	for _, f := range files {
		lang := extensionToLanguage[f.Extension]
		if lang == "" {
			lang = strings.ToUpper(strings.TrimPrefix(f.Extension, "."))
		}
		linesByLang[lang] += f.TotalLines

		name := filepath.Base(f.RelativePath)
		lowerName := strings.ToLower(name)

		if lowerName == "readme.md" || lowerName == "readme" {
			metrics.HasReadme = true
		}
		if lowerName == "dockerfile" || strings.Contains(lowerName, "docker") {
			metrics.HasDocker = true
		}
		if strings.Contains(f.RelativePath, ".github") || strings.Contains(f.RelativePath, "workflows") {
			metrics.HasCI = true
		}
	}

	totalLines := 0
	for _, lines := range linesByLang {
		totalLines += lines
	}

	for lang, lines := range linesByLang {
		if totalLines > 0 {
			percentage := float64(lines) * 100 / float64(totalLines)
			if percentage > 0 {
				metrics.Languages[fmt.Sprintf("%s (%.0f%%)", lang, percentage)] = lines
			}
		}
	}

	metrics.TotalLines = totalLines

	return metrics
}

func selectKeyFiles(files []FileInfo) []FileInfo {
	var keyFiles []FileInfo
	added := make(map[string]bool)

	for _, f := range files {
		name := filepath.Base(f.RelativePath)
		if alwaysInclude[name] && !added[f.RelativePath] {
			keyFiles = append(keyFiles, f)
			added[f.RelativePath] = true
		}
	}

	remaining := 10
	for _, f := range files {
		if remaining <= 0 {
			break
		}
		if !added[f.RelativePath] {
			keyFiles = append(keyFiles, f)
			added[f.RelativePath] = true
			remaining--
		}
	}

	return keyFiles
}

func buildKeyFilesSummary(keyFiles []FileInfo, contentMap map[string]string) string {
	if len(keyFiles) == 0 {
		return ""
	}

	var sb strings.Builder
	sb.WriteString("ARCHIVOS CLAVE:\n")

	for _, f := range keyFiles {
		sb.WriteString(fmt.Sprintf("=== %s ===\n", f.RelativePath))
		if f.First60Lines != "" {
			sb.WriteString(f.First60Lines)
		}
		sb.WriteString("\n\n")
	}

	return sb.String()
}

type AnalysisResultResponse struct {
	ID             string             `json:"id"`
	Filename       string             `json:"filename"`
	Title          string             `json:"title"`
	Dimensions     map[string]float64 `json:"dimensions"`
	Analysis       string             `json:"-"`
	Improvements   []string           `json:"improvements"`
	CreatedAt      string             `json:"created_at"`
	ExtractedFiles []FileInfo         `json:"extracted_files"`
	Tree           []string           `json:"tree"`
	Summary        *SummaryInfo       `json:"summary"`
	FileTree       string             `json:"file_tree"`
	KeyFiles       []FileInfo         `json:"key_files"`
	Metrics        *Metrics           `json:"metrics"`
	Context        *AnalysisContext   `json:"context,omitempty"`
}

func CreateMockAnalysisResult(filename string) *AnalysisResultResponse {
	return &AnalysisResultResponse{
		ID:           uuid.New().String(),
		Filename:     filename,
		Title:        filename,
		Dimensions:   map[string]float64{},
		Improvements: []string{},
		CreatedAt:    "",
	}
}
