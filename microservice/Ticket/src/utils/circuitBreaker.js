class CircuitBreaker {
    constructor(request, options = {}) {
      this.request = request;
      this.state = 'CLOSED';
      this.failureThreshold = options.failureThreshold || 3;
      this.resetTimeout = options.resetTimeout || 30000; // 30 seconds
      this.failureCount = 0;
      this.nextAttempt = Date.now();
    }
  
    async exec(...args) {
      if (this.state === 'OPEN') {
        if (this.nextAttempt <= Date.now()) {
          this.state = 'HALF-OPEN';
        } else {
          throw new Error('Service is currently unavailable');
        }
      }
  
      try {
        const response = await this.request(...args);
        this.onSuccess();
        return response;
      } catch (error) {
        this.onFailure();
        throw error;
      }
    }
  
    onSuccess() {
      this.failureCount = 0;
      this.state = 'CLOSED';
    }
  
    onFailure() {
      this.failureCount += 1;
      if (this.failureCount >= this.failureThreshold) {
        this.state = 'OPEN';
        this.nextAttempt = Date.now() + this.resetTimeout;
      }
    }
  }
  
  module.exports = CircuitBreaker;
  