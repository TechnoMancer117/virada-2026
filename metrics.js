// Tempo total de carregamento
console.log("metrics.js carregado");

window.addEventListener("load", () => {
  const [nav] = performance.getEntriesByType("navigation");
  if (nav) {
    const loadTime = nav.loadEventEnd;
    console.log("Load total:", loadTime.toFixed(2), "ms");
  }
});

// LCP (Largest Contentful Paint)
new PerformanceObserver((list) => {
  const entry = list.getEntries().at(-1);
  console.log("LCP:", entry.startTime.toFixed(2), "ms");
}).observe({ type: "largest-contentful-paint", buffered: true });

// FCP (First Contentful Paint)
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.name === "first-contentful-paint") {
      console.log("FCP:", entry.startTime.toFixed(2), "ms");
    }
  }
}).observe({ type: "paint", buffered: true });

// Quando o usuário sai da página
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    console.log("Usuário saiu da página");
  }
});
