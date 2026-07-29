package middleware

import (
	"net/http"
	"strconv"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

type visitor struct {
	count   int
	resetAt time.Time
}

type RateLimiter struct {
	mu       sync.RWMutex
	visitors map[string]*visitor
	rate     int
	window   time.Duration
	stopCh   chan struct{}
}

func NewRateLimiter(rate int, window time.Duration) *RateLimiter {
	rl := &RateLimiter{
		visitors: make(map[string]*visitor),
		rate:     rate,
		window:   window,
		stopCh:   make(chan struct{}),
	}
	go rl.cleanup(5 * time.Minute)
	return rl
}

func (rl *RateLimiter) Stop() {
	close(rl.stopCh)
}

func (rl *RateLimiter) Allow(key string) (bool, int) {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	now := time.Now()
	v, exists := rl.visitors[key]

	if !exists || now.After(v.resetAt) {
		rl.visitors[key] = &visitor{
			count:   1,
			resetAt: now.Add(rl.window),
		}
		return true, rl.rate - 1
	}

	v.count++

	if v.count > rl.rate {
		return false, 0
	}

	return true, rl.rate - v.count
}

func (rl *RateLimiter) cleanup(interval time.Duration) {
	ticker := time.NewTicker(interval)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			rl.mu.Lock()
			now := time.Now()
			for key, v := range rl.visitors {
				if now.After(v.resetAt) {
					delete(rl.visitors, key)
				}
			}
			rl.mu.Unlock()
		case <-rl.stopCh:
			return
		}
	}
}

func RateLimitByIP(rl *RateLimiter) gin.HandlerFunc {
	return func(c *gin.Context) {
		key := "ip:" + c.ClientIP()
		ok, remaining := rl.Allow(key)
		if !ok {
			c.Header("Retry-After", rl.window.String())
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"success": false,
				"error":   "too many requests, please try again later",
			})
			return
		}
		setRateLimitHeaders(c, rl.rate, remaining, rl.window)
		c.Next()
	}
}

func RateLimitByUser(rl *RateLimiter) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, exists := c.Get("user_id")
		key := "ip:" + c.ClientIP()
		if exists {
			key = "user:" + userID.(string)
		}

		ok, remaining := rl.Allow(key)
		if !ok {
			c.Header("Retry-After", rl.window.String())
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"success": false,
				"error":   "too many requests, please try again later",
			})
			return
		}
		setRateLimitHeaders(c, rl.rate, remaining, rl.window)
		c.Next()
	}
}

func setRateLimitHeaders(c *gin.Context, limit, remaining int, window time.Duration) {
	c.Header("X-RateLimit-Limit", strconv.Itoa(limit))
	c.Header("X-RateLimit-Remaining", strconv.Itoa(remaining))
	c.Header("X-RateLimit-Reset", strconv.Itoa(int(time.Now().Add(window).Unix())))
}
