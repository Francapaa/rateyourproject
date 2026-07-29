package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
)

func TestRateLimiter_Allow_UnderLimit(t *testing.T) {
	rl := NewRateLimiter(5, time.Minute)
	defer rl.Stop()

	for i := 0; i < 5; i++ {
		ok, remaining := rl.Allow("test-key")
		if !ok {
			t.Fatalf("expected request %d to be allowed, but it was denied", i+1)
		}
		if remaining < 0 || remaining > 5 {
			t.Fatalf("expected remaining between 0 and 5, got %d", remaining)
		}
	}
}

func TestRateLimiter_Allow_OverLimit(t *testing.T) {
	rl := NewRateLimiter(3, time.Minute)
	defer rl.Stop()

	for i := 0; i < 3; i++ {
		ok, _ := rl.Allow("test-key")
		if !ok {
			t.Fatalf("expected request %d to be allowed", i+1)
		}
	}

	ok, _ := rl.Allow("test-key")
	if ok {
		t.Fatal("expected 4th request to be denied")
	}
}

func TestRateLimiter_Allow_ResetAfterWindow(t *testing.T) {
	rl := NewRateLimiter(1, 50*time.Millisecond)
	defer rl.Stop()

	ok, _ := rl.Allow("test-key")
	if !ok {
		t.Fatal("expected first request to be allowed")
	}

	ok, _ = rl.Allow("test-key")
	if ok {
		t.Fatal("expected second request (within window) to be denied")
	}

	time.Sleep(60 * time.Millisecond)

	ok, _ = rl.Allow("test-key")
	if !ok {
		t.Fatal("expected request after window reset to be allowed")
	}
}

func TestRateLimiter_DifferentKeys(t *testing.T) {
	rl := NewRateLimiter(2, time.Minute)
	defer rl.Stop()

	for i := 0; i < 2; i++ {
		ok, _ := rl.Allow("key-a")
		if !ok {
			t.Fatalf("expected key-a request %d to be allowed", i+1)
		}
	}

	ok, _ := rl.Allow("key-a")
	if ok {
		t.Fatal("expected key-a 3rd request to be denied")
	}

	ok, _ = rl.Allow("key-b")
	if !ok {
		t.Fatal("expected key-b first request to be allowed (different key)")
	}
}

func TestRateLimiter_ConcurrentAccess(t *testing.T) {
	rl := NewRateLimiter(50, time.Minute)
	defer rl.Stop()

	done := make(chan bool, 50)
	for i := 0; i < 50; i++ {
		go func() {
			rl.Allow("shared-key")
			done <- true
		}()
	}

	for i := 0; i < 50; i++ {
		<-done
	}

	ok, _ := rl.Allow("shared-key")
	if ok {
		t.Fatal("expected 51st request to be denied (limit is 50)")
	}
}

func TestRateLimitByUser_Middleware(t *testing.T) {
	rl := NewRateLimiter(2, time.Minute)
	defer rl.Stop()

	gin.SetMode(gin.TestMode)

	req := httptest.NewRequest(http.MethodGet, "/test", nil)
	rec := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(rec)
	c.Request = req
	c.Set("user_id", "user-123")

	handler := RateLimitByUser(rl)

	handler(c)
	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rec.Code)
	}
}

func TestRateLimitByUser_Middleware_Blocked(t *testing.T) {
	rl := NewRateLimiter(1, time.Minute)
	defer rl.Stop()

	gin.SetMode(gin.TestMode)

	for i := 0; i < 2; i++ {
		req := httptest.NewRequest(http.MethodGet, "/test", nil)
		rec := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(rec)
		c.Request = req
		c.Set("user_id", "user-456")

		handler := RateLimitByUser(rl)
		handler(c)
	}

	req := httptest.NewRequest(http.MethodGet, "/test", nil)
	rec := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(rec)
	c.Request = req
	c.Set("user_id", "user-456")

	handler := RateLimitByUser(rl)
	handler(c)

	if rec.Code != http.StatusTooManyRequests {
		t.Fatalf("expected 429, got %d", rec.Code)
	}
}

func TestRateLimitByIP_Middleware(t *testing.T) {
	rl := NewRateLimiter(5, time.Minute)
	defer rl.Stop()

	gin.SetMode(gin.TestMode)

	req := httptest.NewRequest(http.MethodGet, "/test", nil)
	req.RemoteAddr = "192.168.1.1:12345"
	rec := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(rec)
	c.Request = req

	handler := RateLimitByIP(rl)
	handler(c)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rec.Code)
	}
}
