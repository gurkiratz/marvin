import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBugsData() {
  return [
    {
      id: 1,
      name: 'Race condition',
      bad: [
        '[11:15:00.100] [INFO] Scraper initialized and listening for API requests',
        '[11:15:00.301] [INFO] Interceptor A attached to request ID 789',
        '[11:15:00.302] [INFO] Interceptor B attached to request ID 789',
        '[11:15:00.305] [INFO] Interceptor A parsing response for request ID 789',
        '[11:15:00.306] [INFO] Interceptor B parsing response for request ID 789',
        '[11:15:00.310] [INFO] Interceptor A extracted price: $120.00',
        '[11:15:00.311] [INFO] Interceptor B extracted price: $99.00',
        '[11:15:00.315] [INFO] Interceptor A saved result: $120.00',
        '[11:15:00.316] [INFO] Interceptor B saved result: $99.00',
        '[11:15:00.320] [WARN] Race condition detected on request ID 789 — conflicting results saved',
        '[11:15:00.321] [ERROR] Data integrity issue: price mismatch for product due to multiple interceptors',
      ],
      good: [
        '[11:16:00.100] [INFO] Scraper initialized and listening for API requests',
        '[11:16:00.301] [INFO] Interceptor A attached to request ID 790',
        '[11:16:00.302] [DEBUG] Interceptor B skipped: request ID 790 already handled',
        '[11:16:00.305] [INFO] Interceptor A parsing response for request ID 790',
        '[11:16:00.308] [INFO] Interceptor A extracted price: $89.99',
        '[11:16:00.310] [INFO] Interceptor A saved result: $89.99',
        '[11:16:00.311] [INFO] Scrape complete for product ID 790',
        '[11:16:00.312] [SUCCESS] Data saved cleanly with no interceptor conflict',
      ],
      analysis:
        'The race condition is caused by multiple interceptors attempting to parse and save the same response. The solution is to ensure that only one interceptor can parse and save the response for a given request ID.',
    },
    {
      id: 2,
      bad: [
        '[20:00:01] Navigating to /product/890',
        '[20:00:01] Waiting for .stock-status...',
        '[20:00:06] Timeout: .stock-status not found',
        '[20:00:07] Retry failed',
        '[20:00:07] Scrape failed',
      ],
      good: [
        '[09:13:00] Navigating to /product/890',
        '[09:13:00] Waiting for .stock-status...',
        '[09:13:00] Found: In Stock',
        '[09:13:01] Scrape successful',
      ],
      analysis:
        'The scrape consistently succeeds in the morning but fails around 8 PM. The logs suggest the .stock-status element takes too long to appear during high-traffic hours — a race condition triggered by slow page loads or network congestion.',
    },
    {
      id: 3,
      name: 'IP throttle',
      bad: [
        '[20:00:00] IP: 104.21.33.10',
        '[20:00:01] Navigating to /product/890',
        '[20:00:02] Status: 429 Too Many Requests',
        '[20:00:02] Scrape failed',
      ],
      good: [
        '[09:13:00] IP: 172.67.45.8',
        '[09:13:00] Navigating to /product/890',
        '[09:13:01] Found: In Stock',
        '[09:13:02] Scrape successful',
      ],
      analysis:
        'IP address 104.21.33.10 is being throttled by the server. Try using a load balancer to distribute requests across more IP addresses.',
    },
    {
      id: 4,
      name: 'Occasional Slow Page Load',
      bad: [
        '[13:00:00] Navigating to /product/321',
        '[13:00:01] Waiting for .price...',
        '[13:00:04] Timeout: .price not found',
        '[13:00:04] Scrape failed',
      ],
      good: [
        '[13:05:00] Navigating to /product/321',
        '[13:05:01] Waiting for .price...',
        '[13:05:03] Found price: $74.50',
        '[13:05:04] Scrape successful',
      ],
      analysis:
        'The page occasionally takes longer than expected to render key elements. Increasing the timeout from 3s to 5s (or using a more reliable wait condition like `networkidle`) can resolve this issue.',
    },
  ]
}
