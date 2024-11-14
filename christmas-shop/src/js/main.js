console.log("TEST");

async function loadHeaderFooter() {
  try {
    const headerResponse = await fetch("./src/components/header.html");
    const footerResponse = await fetch("./src/components/footer.html");

    if (!headerResponse.ok || !footerResponse.ok) {
      throw new Error("Не удалось загрузить header или footer.");
    }

    document.getElementById("header-placeholder").innerHTML =
      await headerResponse.text();
    document.getElementById("footer-placeholder").innerHTML =
      await footerResponse.text();

    console.log("Footer loaded successfully");
  } catch (error) {
    console.error("Ошибка при загрузке header или footer:", error);
  }
}

loadHeaderFooter();
