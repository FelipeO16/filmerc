declare global {
  function gtag(...args: unknown[]): void
}

interface AnalyticsEvent {
  action: string
  category: string
  label?: string
  value?: number
}

export function trackPageView(page: string) {
  if (typeof gtag !== 'undefined') {
    gtag('config', 'GA_MEASUREMENT_ID', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: page
    })
  }

  sendAnalyticsEvent({
    action: 'page_view',
    category: 'engagement',
    label: page
  })
}

export function trackEvent(event: AnalyticsEvent) {
  if (typeof gtag !== 'undefined') {
    gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value
    })
  }

  sendAnalyticsEvent(event)
}

async function sendAnalyticsEvent(event: AnalyticsEvent) {
  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...event,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        url: window.location.href
      })
    })
  } catch (error) {
    console.warn('Failed to send analytics event:', error)
  }
}

export function trackPerformance() {
  if ('performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming

        if (navigation) {
          const metrics = {
            dns: navigation.domainLookupEnd - navigation.domainLookupStart,
            tcp: navigation.connectEnd - navigation.connectStart,
            ttfb: navigation.responseStart - navigation.requestStart,
            domLoad: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            windowLoad: navigation.loadEventEnd - navigation.loadEventStart,
            total: navigation.loadEventEnd - navigation.fetchStart
          }

          trackEvent({
            action: 'performance',
            category: 'performance',
            label: 'page_load',
            value: Math.round(metrics.total)
          })
        }
      }, 0)
    })
  }
}

export function trackCoreWebVitals() {
  console.log('Web Vitals tracking requires web-vitals package')
}

export function initializeAnalytics() {
  trackPerformance()
  trackCoreWebVitals()
}
