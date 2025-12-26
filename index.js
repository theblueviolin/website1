function goToSection(id) {
    const section = document.getElementById(id);
    if (!section) return;
  
    const headerOffset = 80;
    const elementPosition = section.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - headerOffset;
  
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  }
  
  function openExternal(url) {
    window.open(url, "_blank", "noopener,noreferrer");
  }
  