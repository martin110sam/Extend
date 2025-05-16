document.addEventListener("DOMContentLoaded", function () {
  // Initial variables
  const productForm = document.getElementById("product-form"); // ✅ UPDATED to match new form ID
  const productName = document.querySelector(".product-title");
  const productPriceElement = document.querySelector(".product-price");
  const image = document.querySelector(".product-image");
  const variantSelect = document.getElementById("variant");
  const protectionCheckbox = document.getElementById("add-protection-checkbox"); // ✅ NEW
  const extendOfferContainer = document.getElementById("extend-offer"); // ✅ NEW

  let variantId;
  let productPrice;
  let category;

  // Get default selected products variantId value
  if (variantSelect.options && variantSelect.options[variantSelect.selectedIndex]) {
    const defaultProduct = variantSelect.options[variantSelect.selectedIndex];

    if (
      defaultProduct &&
      defaultProduct.value &&
      defaultProduct.getAttribute("data-product-price") &&
      defaultProduct.getAttribute("data-product-category") &&
      defaultProduct.getAttribute("data-product-name")
    ) {
      defaultProduct.setAttribute("selected", "");
      productName.innerText = defaultProduct.getAttribute("data-product-name");
      productPriceElement.innerText = `$${defaultProduct.getAttribute("data-product-price")}`;

      variantId = defaultProduct.value;
      productPrice = parseInt(defaultProduct.getAttribute("data-product-price")) * 100;
      category = defaultProduct.getAttribute("data-product-category");

      if (!variantId || !productPrice || !category) return;

      // ✅ Render Extend offer if checkbox is checked
      if (protectionCheckbox.checked) {
        extendOfferContainer.style.display = "block"; // ✅ show offer
        Extend.buttons.render("#extend-offer", {
          referenceId: variantId,
          price: productPrice,
          category: category,
        });
      }
    }
  }

  // ✅ Toggle visibility + render on checkbox change
  protectionCheckbox.addEventListener("change", function () {
    if (this.checked) {
      extendOfferContainer.style.display = "block";

      // Check if Extend already rendered; if not, render it
      if (!Extend.buttons.instance("#extend-offer")) {
        Extend.buttons.render("#extend-offer", {
          referenceId: variantId,
          price: productPrice,
          category: category,
        });
      }
    } else {
      extendOfferContainer.style.display = "none";
    }
  });

  // Attach event listener to the product form
  productForm.addEventListener("change", function (event) {
    // Clear all selected attributes and set the new one
    Array.from(variantSelect.options).forEach((option) => option.removeAttribute("selected"));

    const selectedOption = event.target.selectedOptions?.[0];
    if (!selectedOption) return;

    selectedOption.setAttribute("selected", "");

    if (selectedOption.getAttribute("data-image") && productName && productPriceElement) {
      image.src = selectedOption.getAttribute("data-image");
      productName.textContent = selectedOption.getAttribute("data-product-name");
      productPriceElement.textContent = `$${selectedOption.getAttribute("data-product-price")}`;
    }

    if (
      !selectedOption.getAttribute("data-product-price") ||
      !selectedOption.getAttribute("data-product-category") ||
      !selectedOption.value
    )
      return;

    variantId = selectedOption.value;
    productPrice = parseInt(selectedOption.getAttribute("data-product-price")) * 100;
    category = selectedOption.getAttribute("data-product-category");

    window.history.pushState(null, null, `?variant=${variantId}`);

    if (!variantId || !productPrice || !category) return;

    // ✅ If checkbox is checked, update the Extend offer
    if (protectionCheckbox.checked) {
      const component = Extend.buttons.instance("#extend-offer");
      if (component) {
        component.setActiveProduct(variantId);
      }
    }
  });
});
