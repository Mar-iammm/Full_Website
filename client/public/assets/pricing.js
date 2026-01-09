document.addEventListener("DOMContentLoaded", () => {
    const monthlyTab = document.querySelector('[data-w-tab="Monthly"]');
    const yearlyTab = document.querySelector('[data-w-tab="Yearly"]');
    const monthlyContent = document.querySelector('.pricing-tab-pane[data-w-tab="Monthly"]');
    const yearlyContent = document.querySelector('.pricing-tab-pane[data-w-tab="Yearly"]');
  
    if (monthlyTab && yearlyTab && monthlyContent && yearlyContent) {
      monthlyTab.addEventListener("click", () => {
        // Activate Monthly Tab
        monthlyTab.classList.add("w--current");
        yearlyTab.classList.remove("w--current");
  
        // Show Monthly Content
        monthlyContent.classList.add("w--tab-active");
        yearlyContent.classList.remove("w--tab-active");
      });
  
      yearlyTab.addEventListener("click", () => {
        // Activate Yearly Tab
        yearlyTab.classList.add("w--current");
        monthlyTab.classList.remove("w--current");
  
        // Show Yearly Content
        yearlyContent.classList.add("w--tab-active");
        monthlyContent.classList.remove("w--tab-active");
      });
    }
  });