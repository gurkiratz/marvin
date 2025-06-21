import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBugsData() {
  return [
    {
      id: 1,
      name: 'Memory leak causing periodic crashes',
      bad: [
        '[14:30:00] Starting scrape batch #847',
        '[14:30:01] Memory usage: 1.2GB',
        '[14:32:15] Memory usage: 2.8GB',
        '[14:34:32] Memory usage: 4.1GB',
        '[14:35:45] WARNING: Memory usage critical: 5.7GB',
        '[14:36:12] FATAL: Out of memory error',
        '[14:36:12] Process terminated unexpectedly',
        '[14:36:15] Scrape batch #847 failed after 372 seconds',
      ],
      good: [
        '[09:15:00] Starting scrape batch #523',
        '[09:15:01] Memory usage: 1.2GB',
        '[09:17:30] Memory usage: 1.4GB',
        '[09:19:45] Memory usage: 1.6GB',
        '[09:21:12] Memory usage: 1.3GB (garbage collection triggered)',
        '[09:23:45] Scrape batch #523 completed successfully',
        '[09:23:46] Memory usage: 1.1GB',
      ],
      diagnosis:
        "Memory leak occurs when garbage collection doesn't trigger properly during long-running scrapes. The issue appears to be browser instances not being properly disposed of, causing memory to accumulate over time until the process crashes.",
      diagnosis_steps: [
        {
          name: 'Analyzing logs',
          description:
            'From the existing logs, we can observe unusual behavior or failure points such as repeated requests, timeouts, or conflicting data being processed.',
        },
        {
          name: 'Adding logs',
          description:
            'To understand more about the root cause, I am adding additional logging around network requests, DOM element wait times, and internal logic handling to capture more context.',
        },
        {
          name: 'Analyzing logs',
          description:
            "The new logs show detailed timings, error codes, and decision branches that indicate where the problem is surfacing, helping to pinpoint whether it's timing, resource loading, or logic conflict.",
        },
        {
          name: 'Diagnosing',
          description:
            'After analyzing both the original and new logs from production, the root cause appears to be tied to a specific set of conditions such as race conditions, throttling, or slow-loading elements that require mitigation.',
        },
      ],
    },
    {
      id: 2,
      name: 'Session token expiration',
      bad: [
        '[11:45:33] Session token: abc123...expires in 3602s',
        '[12:47:12] Navigating to /dashboard/products',
        '[12:47:13] Status: 401 Unauthorized',
        '[12:47:13] ERROR: Session expired unexpectedly',
        '[12:47:14] Attempting token refresh...',
        '[12:47:15] Token refresh failed: invalid_grant',
        '[12:47:15] Scrape aborted',
      ],
      good: [
        '[08:30:15] Session token: xyz789...expires in 3598s',
        '[09:28:45] Navigating to /dashboard/products',
        '[09:28:46] Status: 200 OK',
        '[09:28:47] Found 47 products',
        '[09:29:12] Token still valid for 1834s',
        '[09:29:13] Scrape completed successfully',
      ],
      diagnosis:
        'Session tokens are expiring earlier than their stated expiration time, likely due to server-side session cleanup or timezone discrepancies. The token refresh mechanism fails when the original token is considered invalid by the server.',
      diagnosis_steps: [
        {
          name: 'Analyzing logs',
          description:
            'From the existing logs, we can observe unusual behavior or failure points such as repeated requests, timeouts, or conflicting data being processed.',
        },
        {
          name: 'Adding logs',
          description:
            'To understand more about the root cause, I am adding additional logging around network requests, DOM element wait times, and internal logic handling to capture more context.',
        },
        {
          name: 'Analyzing logs',
          description:
            "The new logs show detailed timings, error codes, and decision branches that indicate where the problem is surfacing, helping to pinpoint whether it's timing, resource loading, or logic conflict.",
        },
        {
          name: 'Diagnosing',
          description:
            'After analyzing both the original and new logs from production, the root cause appears to be tied to a specific set of conditions such as race conditions, throttling, or slow-loading elements that require mitigation.',
        },
      ],
    },
    {
      id: 3,
      name: 'User agent detection triggering different content',
      bad: [
        '[16:22:10] User-Agent: Chrome/118.0.0.0 (headless)',
        '[16:22:11] Navigating to /products/laptop-deals',
        '[16:22:12] Waiting for .product-grid...',
        '[16:22:15] Found element: .bot-detection-message',
        "[16:22:15] Content: 'Please enable JavaScript to continue'",
        '[16:22:16] ERROR: Bot detection triggered',
        '[16:22:16] Scrape failed',
      ],
      good: [
        '[10:15:30] User-Agent: Chrome/118.0.0.0',
        '[10:15:31] Navigating to /products/laptop-deals',
        '[10:15:32] Waiting for .product-grid...',
        '[10:15:33] Found 24 products in grid',
        '[10:15:45] Extracted all product data',
        '[10:15:46] Scrape successful',
      ],
      diagnosis:
        'The website intermittently serves different content based on user agent detection. Headless browsers or certain user agent strings trigger bot detection mechanisms that display placeholder content instead of actual product data.',
      diagnosis_steps: [
        {
          name: 'Analyzing logs',
          description:
            'From the existing logs, we can observe unusual behavior or failure points such as repeated requests, timeouts, or conflicting data being processed.',
        },
        {
          name: 'Adding logs',
          description:
            'To understand more about the root cause, I am adding additional logging around network requests, DOM element wait times, and internal logic handling to capture more context.',
        },
        {
          name: 'Analyzing logs',
          description:
            "The new logs show detailed timings, error codes, and decision branches that indicate where the problem is surfacing, helping to pinpoint whether it's timing, resource loading, or logic conflict.",
        },
        {
          name: 'Diagnosing',
          description:
            'After analyzing both the original and new logs from production, the root cause appears to be tied to a specific set of conditions such as race conditions, throttling, or slow-loading elements that require mitigation.',
        },
      ],
    },
    {
      id: 4,
      name: 'JavaScript execution timing race condition',
      bad: [
        '[19:05:12] Page loaded: /search?q=wireless-headphones',
        "[19:05:13] Executing: document.querySelector('.load-more').click()",
        "[19:05:13] ERROR: Cannot read property 'click' of null",
        '[19:05:14] Waiting 2s for element to appear...',
        '[19:05:16] Element still not found',
        '[19:05:16] Script execution failed',
      ],
      good: [
        '[12:33:45] Page loaded: /search?q=wireless-headphones',
        '[12:33:46] Waiting for .load-more button...',
        '[12:33:47] Button appeared, executing click',
        '[12:33:47] Additional products loaded',
        '[12:33:52] Script execution successful',
      ],
      diagnosis:
        "JavaScript elements are being accessed before they're fully rendered in the DOM. The timing varies based on page load speed, causing intermittent failures when scripts try to interact with elements that haven't appeared yet.",
      diagnosis_steps: [
        {
          name: 'Analyzing logs',
          description:
            'From the existing logs, we can observe unusual behavior or failure points such as repeated requests, timeouts, or conflicting data being processed.',
        },
        {
          name: 'Adding logs',
          description:
            'To understand more about the root cause, I am adding additional logging around network requests, DOM element wait times, and internal logic handling to capture more context.',
        },
        {
          name: 'Analyzing logs',
          description:
            "The new logs show detailed timings, error codes, and decision branches that indicate where the problem is surfacing, helping to pinpoint whether it's timing, resource loading, or logic conflict.",
        },
        {
          name: 'Diagnosing',
          description:
            'After analyzing both the original and new logs from production, the root cause appears to be tied to a specific set of conditions such as race conditions, throttling, or slow-loading elements that require mitigation.',
        },
      ],
    },
    {
      id: 5,
      name: 'Database connection pool exhaustion',
      bad: [
        '[15:44:20] Starting scrape operation for 500 products',
        '[15:44:21] DB connections in pool: 8/10 active',
        '[15:46:33] DB connections in pool: 10/10 active',
        '[15:46:45] WARNING: Connection pool exhausted',
        '[15:46:46] ERROR: Unable to acquire database connection',
        '[15:46:46] Timeout waiting for available connection (30s)',
        '[15:46:47] Data save operation failed',
        '[15:46:47] Rolling back transaction',
      ],
      good: [
        '[09:22:15] Starting scrape operation for 200 products',
        '[09:22:16] DB connections in pool: 3/10 active',
        '[09:24:22] DB connections in pool: 6/10 active',
        '[09:25:01] DB connections in pool: 4/10 active',
        '[09:25:33] All data saved successfully',
        '[09:25:34] DB connections in pool: 2/10 active',
      ],
      diagnosis:
        "During high-volume scraping operations, database connections aren't being released properly, leading to pool exhaustion. This happens intermittently when multiple concurrent scrapes run simultaneously or when network latency causes connections to be held longer than expected.",
      diagnosis_steps: [
        {
          name: 'Analyzing logs',
          description:
            'From the existing logs, we can observe unusual behavior or failure points such as repeated requests, timeouts, or conflicting data being processed.',
        },
        {
          name: 'Adding logs',
          description:
            'To understand more about the root cause, I am adding additional logging around network requests, DOM element wait times, and internal logic handling to capture more context.',
        },
        {
          name: 'Analyzing logs',
          description:
            "The new logs show detailed timings, error codes, and decision branches that indicate where the problem is surfacing, helping to pinpoint whether it's timing, resource loading, or logic conflict.",
        },
        {
          name: 'Diagnosing',
          description:
            'After analyzing both the original and new logs from production, the root cause appears to be tied to a specific set of conditions such as race conditions, throttling, or slow-loading elements that require mitigation.',
        },
      ],
    },
    {
      id: 6,
      name: 'CDN serving stale cached content',
      bad: [
        '[13:15:22] Requesting: /api/products/12345',
        '[13:15:23] Cache-Control: max-age=3600',
        '[13:15:23] Last-Modified: 2024-06-20T08:30:00Z',
        '[13:15:24] Product price extracted: $89.99',
        '[13:15:24] WARNING: Price seems outdated (expected ~$120)',
        '[13:15:25] CDN served stale content',
        '[13:15:25] Data validation failed',
      ],
      good: [
        '[13:45:10] Requesting: /api/products/12345',
        '[13:45:11] Cache-Control: max-age=3600',
        '[13:45:11] Last-Modified: 2024-06-21T13:20:00Z',
        '[13:45:12] Product price extracted: $119.99',
        '[13:45:12] Price validation passed',
        '[13:45:13] Fresh content received from origin',
      ],
      diagnosis:
        'CDN is intermittently serving cached content that has exceeded its intended freshness period. This happens when cache invalidation fails or when different CDN edge nodes have inconsistent cache states, resulting in stale product information being scraped.',
      diagnosis_steps: [
        {
          name: 'Analyzing logs',
          description:
            'From the existing logs, we can observe unusual behavior or failure points such as repeated requests, timeouts, or conflicting data being processed.',
        },
        {
          name: 'Adding logs',
          description:
            'To understand more about the root cause, I am adding additional logging around network requests, DOM element wait times, and internal logic handling to capture more context.',
        },
        {
          name: 'Analyzing logs',
          description:
            "The new logs show detailed timings, error codes, and decision branches that indicate where the problem is surfacing, helping to pinpoint whether it's timing, resource loading, or logic conflict.",
        },
        {
          name: 'Diagnosing',
          description:
            'After analyzing both the original and new logs from production, the root cause appears to be tied to a specific set of conditions such as race conditions, throttling, or slow-loading elements that require mitigation.',
        },
      ],
    },
    {
      id: 7,
      name: 'Third-party API rate limiting fluctuation',
      bad: [
        '[17:30:15] Calling geocoding API for address validation',
        '[17:30:16] Request count: 847/1000 (daily limit)',
        '[17:30:17] Status: 429 Too Many Requests',
        '[17:30:17] Rate limit headers: X-RateLimit-Remaining: 0',
        '[17:30:18] Retry-After: 3600 seconds',
        '[17:30:18] ERROR: API quota exceeded unexpectedly',
        '[17:30:18] Address validation failed',
      ],
      good: [
        '[09:45:22] Calling geocoding API for address validation',
        '[09:45:23] Request count: 234/1000 (daily limit)',
        '[09:45:24] Status: 200 OK',
        '[09:45:24] Rate limit headers: X-RateLimit-Remaining: 765',
        '[09:45:25] Address coordinates: 40.7128, -74.0060',
        '[09:45:25] Address validation successful',
      ],
      diagnosis:
        'Third-party API rate limits are being hit sooner than expected, possibly due to other applications sharing the same API key or the provider changing their rate limiting algorithm. The daily quota appears to reset at unpredictable times.',
      diagnosis_steps: [
        {
          name: 'Analyzing logs',
          description:
            'From the existing logs, we can observe unusual behavior or failure points such as repeated requests, timeouts, or conflicting data being processed.',
        },
        {
          name: 'Adding logs',
          description:
            'To understand more about the root cause, I am adding additional logging around network requests, DOM element wait times, and internal logic handling to capture more context.',
        },
        {
          name: 'Analyzing logs',
          description:
            "The new logs show detailed timings, error codes, and decision branches that indicate where the problem is surfacing, helping to pinpoint whether it's timing, resource loading, or logic conflict.",
        },
        {
          name: 'Diagnosing',
          description:
            'After analyzing both the original and new logs from production, the root cause appears to be tied to a specific set of conditions such as race conditions, throttling, or slow-loading elements that require mitigation.',
        },
      ],
    },
    {
      id: 8,
      name: 'Browser window focus affecting JavaScript execution',
      bad: [
        '[14:20:30] Opening new browser tab for /interactive-catalog',
        '[14:20:31] Tab created but not focused (background tab)',
        '[14:20:32] Waiting for image lazy-loading...',
        '[14:20:37] Timeout: Images not loaded after 5s',
        '[14:20:37] IntersectionObserver not triggered',
        '[14:20:38] ERROR: Product images missing',
        '[14:20:38] Scrape incomplete',
      ],
      good: [
        '[11:35:45] Opening new browser tab for /interactive-catalog',
        '[11:35:46] Tab focused and active',
        '[11:35:47] Waiting for image lazy-loading...',
        '[11:35:49] IntersectionObserver triggered',
        '[11:35:51] All 36 product images loaded',
        '[11:35:52] Scrape completed successfully',
      ],
      diagnosis:
        'Some websites use visibility APIs or intersection observers that only function when the browser tab is focused and visible. When the scraper runs in background tabs or headless mode, certain JavaScript-dependent content fails to load properly.',
      diagnosis_steps: [
        {
          name: 'Analyzing logs',
          description:
            'From the existing logs, we can observe unusual behavior or failure points such as repeated requests, timeouts, or conflicting data being processed.',
        },
        {
          name: 'Adding logs',
          description:
            'To understand more about the root cause, I am adding additional logging around network requests, DOM element wait times, and internal logic handling to capture more context.',
        },
        {
          name: 'Analyzing logs',
          description:
            "The new logs show detailed timings, error codes, and decision branches that indicate where the problem is surfacing, helping to pinpoint whether it's timing, resource loading, or logic conflict.",
        },
        {
          name: 'Diagnosing',
          description:
            'After analyzing both the original and new logs from production, the root cause appears to be tied to a specific set of conditions such as race conditions, throttling, or slow-loading elements that require mitigation.',
        },
      ],
    },
    {
      id: 9,
      name: 'Random CAPTCHA appearing during scraping',
      bad: [
        '[12:15:33] Navigating to product page #127',
        '[12:15:34] Page loaded successfully',
        '[12:15:35] Waiting for .product-details...',
        '[12:15:36] Found element: .captcha-challenge',
        "[12:15:36] CAPTCHA detected: 'Select all images with traffic lights'",
        '[12:15:37] ERROR: Cannot proceed without human interaction',
        '[12:15:37] Scraping session terminated',
      ],
      good: [
        '[12:10:15] Navigating to product page #89',
        '[12:10:16] Page loaded successfully',
        '[12:10:17] Waiting for .product-details...',
        '[12:10:18] Found product title, price, and description',
        '[12:10:19] No anti-bot measures detected',
        '[12:10:20] Data extracted successfully',
      ],
      diagnosis:
        'The website randomly presents CAPTCHA challenges based on behavioral analysis or request patterns. This appears to be triggered by factors like request frequency, IP reputation, or session duration, making it unpredictable when CAPTCHAs will appear.',
      diagnosis_steps: [
        {
          name: 'Analyzing logs',
          description:
            'From the existing logs, we can observe unusual behavior or failure points such as repeated requests, timeouts, or conflicting data being processed.',
        },
        {
          name: 'Adding logs',
          description:
            'To understand more about the root cause, I am adding additional logging around network requests, DOM element wait times, and internal logic handling to capture more context.',
        },
        {
          name: 'Analyzing logs',
          description:
            "The new logs show detailed timings, error codes, and decision branches that indicate where the problem is surfacing, helping to pinpoint whether it's timing, resource loading, or logic conflict.",
        },
        {
          name: 'Diagnosing',
          description:
            'After analyzing both the original and new logs from production, the root cause appears to be tied to a specific set of conditions such as race conditions, throttling, or slow-loading elements that require mitigation.',
        },
      ],
    },
    {
      id: 10,
      name: 'Network proxy rotation causing SSL handshake failures',
      bad: [
        '[18:44:12] Rotating to proxy: 203.0.113.45:8080',
        '[18:44:13] Establishing connection to target site',
        '[18:44:14] SSL handshake initiated',
        '[18:44:17] ERROR: SSL handshake timeout (3000ms)',
        '[18:44:17] TLS version mismatch detected',
        '[18:44:18] Connection failed through proxy',
        '[18:44:18] Scrape attempt failed',
      ],
      good: [
        '[18:42:30] Rotating to proxy: 198.51.100.23:8080',
        '[18:42:31] Establishing connection to target site',
        '[18:42:32] SSL handshake completed successfully',
        '[18:42:33] TLS 1.3 connection established',
        '[18:42:34] HTTPS request successful',
        '[18:42:35] Data retrieved through proxy',
      ],
      diagnosis:
        'Certain proxy servers in the rotation pool have SSL/TLS configuration issues or are located in regions with different certificate trust stores. This causes intermittent SSL handshake failures when those specific proxies are selected in the rotation.',
      diagnosis_steps: [
        {
          name: 'Analyzing logs',
          description:
            'From the existing logs, we can observe unusual behavior or failure points such as repeated requests, timeouts, or conflicting data being processed.',
        },
        {
          name: 'Adding logs',
          description:
            'To understand more about the root cause, I am adding additional logging around network requests, DOM element wait times, and internal logic handling to capture more context.',
        },
        {
          name: 'Analyzing logs',
          description:
            "The new logs show detailed timings, error codes, and decision branches that indicate where the problem is surfacing, helping to pinpoint whether it's timing, resource loading, or logic conflict.",
        },
        {
          name: 'Diagnosing',
          description:
            'After analyzing both the original and new logs from production, the root cause appears to be tied to a specific set of conditions such as race conditions, throttling, or slow-loading elements that require mitigation.',
        },
      ],
    },
  ]
}

export function getGraphData() {
  return [
    {
      timestamp: '2025-06-21T00:00:00Z',
      successRate: 0.79,
      failureRate: 0.21,
    },
    {
      timestamp: '2025-06-21T01:00:00Z',
      successRate: 0.91,
      failureRate: 0.09,
    },
    {
      timestamp: '2025-06-21T02:00:00Z',
      successRate: 0.94,
      failureRate: 0.06,
    },
    {
      timestamp: '2025-06-21T03:00:00Z',
      successRate: 0.97,
      failureRate: 0.03,
    },
    {
      timestamp: '2025-06-21T04:00:00Z',
      successRate: 0.92,
      failureRate: 0.08,
    },
    {
      timestamp: '2025-06-21T05:00:00Z',
      successRate: 0.95,
      failureRate: 0.05,
    },
    {
      timestamp: '2025-06-21T06:00:00Z',
      successRate: 0.93,
      failureRate: 0.07,
    },
    {
      timestamp: '2025-06-21T07:00:00Z',
      successRate: 0.59,
      failureRate: 0.41,
    },
    {
      timestamp: '2025-06-21T08:00:00Z',
      successRate: 0.82,
      failureRate: 0.18,
    },
    {
      timestamp: '2025-06-21T09:00:00Z',
      successRate: 0.94,
      failureRate: 0.06,
    },
    {
      timestamp: '2025-06-21T10:00:00Z',
      successRate: 0.97,
      failureRate: 0.03,
    },
    {
      timestamp: '2025-06-21T11:00:00Z',
      successRate: 0.91,
      failureRate: 0.09,
    },
    {
      timestamp: '2025-06-21T12:00:00Z',
      successRate: 0.96,
      failureRate: 0.04,
    },
    {
      timestamp: '2025-06-21T13:00:00Z',
      successRate: 0.93,
      failureRate: 0.07,
    },
    {
      timestamp: '2025-06-21T14:00:00Z',
      successRate: 0.81,
      failureRate: 0.19,
    },
    {
      timestamp: '2025-06-21T15:00:00Z',
      successRate: 0.89,
      failureRate: 0.11,
    },
    {
      timestamp: '2025-06-21T16:00:00Z',
      successRate: 0.84,
      failureRate: 0.16,
    },
    {
      timestamp: '2025-06-21T17:00:00Z',
      successRate: 0.95,
      failureRate: 0.05,
    },
    {
      timestamp: '2025-06-21T18:00:00Z',
      successRate: 0.9,
      failureRate: 0.1,
    },
    {
      timestamp: '2025-06-21T19:00:00Z',
      successRate: 0.93,
      failureRate: 0.07,
    },
    {
      timestamp: '2025-06-21T20:00:00Z',
      successRate: 0.91,
      failureRate: 0.09,
    },
    {
      timestamp: '2025-06-21T21:00:00Z',
      successRate: 0.62,
      failureRate: 0.38,
    },
    {
      timestamp: '2025-06-21T22:00:00Z',
      successRate: 0.92,
      failureRate: 0.08,
    },
    {
      timestamp: '2025-06-21T23:00:00Z',
      successRate: 0.96,
      failureRate: 0.04,
    },
    {
      timestamp: '2025-06-22T00:00:00Z',
      successRate: 0.87,
      failureRate: 0.13,
    },
    {
      timestamp: '2025-06-22T01:00:00Z',
      successRate: 0.94,
      failureRate: 0.06,
    },
    {
      timestamp: '2025-06-22T02:00:00Z',
      successRate: 0.9,
      failureRate: 0.1,
    },
    {
      timestamp: '2025-06-22T03:00:00Z',
      successRate: 0.96,
      failureRate: 0.04,
    },
    {
      timestamp: '2025-06-22T04:00:00Z',
      successRate: 0.57,
      failureRate: 0.43,
    },
    {
      timestamp: '2025-06-22T05:00:00Z',
      successRate: 0.89,
      failureRate: 0.11,
    },
  ]
}
