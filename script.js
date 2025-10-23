document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("urlInput");
  const status = document.getElementById("status");
  const resetBtn = document.getElementById("resetBtn");
  let timer = null;
  let lastRequestedUrl = "";

  function isValidUrl(url) {
    const pattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;
    return pattern.test(url);
  }

  function mockServerCheck(url) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const lower = url.toLowerCase();
        let exists = false;
        let type = null;

        if (lower.includes("file")) {
          exists = true;
          type = "file";
        } else if (lower.includes("folder")) {
          exists = true;
          type = "folder";
        }

        resolve({ exists, type, url });
      }, 700);
    });
  }

  async function runServerCheck(url) {
    lastRequestedUrl = url;
    status.innerHTML = `<span class="loader"></span> Checking...`;
    status.className = "text-gray";

    const result = await mockServerCheck(url);
    if (result.url !== lastRequestedUrl) return;

    if (!result.exists) {
      status.textContent = "🚫 URL does not exist";
      status.className = "text-red";
    } else {
      status.textContent =
        result.type === "file"
          ? "✅ URL exists and points to a file"
          : "📁 URL exists and points to a folder";
      status.className = "text-green";
    }
  }

  input.addEventListener("input", () => {
    const url = input.value.trim();

    if (url === "") {
      clearTimeout(timer);
      input.className = "";
      status.textContent = "";
      status.className = "";
      return;
    }

    if (!isValidUrl(url)) {
      clearTimeout(timer);
      input.className = "invalid";
      status.textContent = "❌ Invalid URL format";
      status.className = "text-red";
      return;
    }

    input.className = "valid";
    status.textContent = "✔️ Valid URL format";
    status.className = "text-green";

    clearTimeout(timer);
    timer = setTimeout(() => runServerCheck(url), 600);
  });

  resetBtn.addEventListener("click", () => {
    input.value = "";
    input.className = "";
    status.textContent = "";
    status.className = "";
    input.focus();
    lastRequestedUrl = "";
    clearTimeout(timer);
  });
});
