const storeConfig = {
  whatsappNumber: "966534879245",
  companyName: "حراج الرفوف السعودية",
  defaultMessage: "مرحباً، أنا اريد شراء هذا المنتج: ",
};

document.addEventListener("DOMContentLoaded", function () {
  initializeCategoryFilter();
  initializeWhatsAppButtons();
});

function initializeCategoryFilter() {
  const categoryButtons = document.querySelectorAll(".category-btn");
  const productCards = document.querySelectorAll(".product-card");

  categoryButtons.forEach((button) => {
    button.addEventListener("click", function () {
      categoryButtons.forEach((btn) => btn.classList.remove("active"));

      this.classList.add("active");

      const category = this.getAttribute("data-category");
      filterProducts(category, productCards);
    });
  });
}

function filterProducts(category, productCards) {
  productCards.forEach((card) => {
    if (category === "all" || card.getAttribute("data-category") === category) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
}

function initializeWhatsAppButtons() {
  const whatsappButtons = document.querySelectorAll(".whatsapp-btn");

  whatsappButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();

      const productName = this.getAttribute("data-product");
      const message = `${storeConfig.defaultMessage}${productName} - ${storeConfig.companyName}`;
      const whatsappURL = `https://wa.me/${
        storeConfig.whatsappNumber
      }?text=${encodeURIComponent(message)}`;

      window.open(whatsappURL, "_blank");
    });
  });
}

function toggleBlogText(elementId, button) {
  const textElement = document.getElementById(elementId);

  if (!textElement) return;

  const isCollapsed = textElement.classList.contains("collapsed");

  if (isCollapsed) {
    textElement.classList.remove("collapsed");
    textElement.classList.add("expanded");
    button.innerHTML = '<i class="fas fa-arrow-up"></i> عرض أقل';
    button.classList.add("active");
  } else {
    textElement.classList.add("collapsed");
    textElement.classList.remove("expanded");
    button.innerHTML = '<i class="fas fa-arrow-down"></i> قراءة المزيد';
    button.classList.remove("active");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const blogTexts = document.querySelectorAll(".blog-text");
  blogTexts.forEach((text) => {
    text.classList.add("collapsed");
    text.classList.remove("expanded");
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const backToTopButton = document.getElementById("backToTop");

  window.onscroll = function () {
    if (
      document.body.scrollTop > 400 ||
      document.documentElement.scrollTop > 400
    ) {
      backToTopButton.classList.add("show");
    } else {
      backToTopButton.classList.remove("show");
    }
  };

  backToTopButton.onclick = function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
});
