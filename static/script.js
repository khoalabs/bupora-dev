document.addEventListener("DOMContentLoaded", () => {
  // ======================
  // GLOBAL
  // ======================

  const y = document.getElementById("year") // Footer year
  if (y) y.textContent = new Date().getFullYear()
  
  // ======================
  // SEARCH
  // ======================

  const siteHeader = document.getElementById("siteHeader")
  const input = document.getElementById("searchInput")
  const clearBtn = document.getElementById("clearBtn") // Search clear button
  const nav = document.getElementById("mainNav")
  const form = input?.closest("form")
  const mobileOpen = document.getElementById("mobileSearchOpen")
  const headerRow = document.getElementById("headerRow")
  const hamburger = document.getElementById("sidebarOpen")
  const logo = headerRow?.querySelector("a")

  let isClearing = false

  // ======================
  // DESKTOP SEARCH
  // ======================
  
  if (input && nav && form) {
    input.addEventListener("focus", () => {

      if (window.innerWidth < 768) return

      if (!form.classList.contains("flex-1")) {
        nav.classList.add("md:hidden")
        form.classList.add("flex-1")
        input.classList.remove("w-44")
        input.classList.add("w-full") // expand
      }
    })

    input.addEventListener("blur", () => {
      if (isClearing) {
        isClearing = false // clear for skip collapse
        return
      }

      if (!input.value) {

        if (window.innerWidth < 768) {

          form.classList.remove("flex-1")
          form.classList.add("hidden")

          hamburger?.classList.remove("hidden")
          logo?.classList.remove("hidden")
          mobileOpen?.classList.remove("hidden")

        } else {

          nav.classList.remove("md:hidden")
          form.classList.remove("flex-1")
          input.classList.remove("w-full")
          input.classList.add("w-44")

        }
      }
    })

  }

  // ======================
  // MOBILE SEARCH OPEN
  // ======================
  if (mobileOpen && input && form && headerRow) {

    mobileOpen.addEventListener("click", () => {

      if (window.innerWidth >= 768) return

      form.classList.remove("hidden")
      form.classList.add("flex-1")
      input.classList.remove("w-44")
      input.classList.add("w-full")

      // hamburger?.classList.add("hidden")
      hamburger?.classList.remove("hidden")
      logo?.classList.add("hidden")
      mobileOpen.classList.add("hidden")

      input.focus()
      
      if (input.value.length) {
        input.setSelectionRange(input.value.length, input.value.length)
      }

    })

  }

  // ======================
  // CLEAR BUTTON
  // ======================

  if (input && clearBtn) {

    let wasFocusedBeforeClear = false

    clearBtn.addEventListener("mousedown", () => {
      wasFocusedBeforeClear = document.activeElement === input
    })
    
    clearBtn.classList.toggle("hidden", !input.value) // initial state
    
    input.addEventListener("input", () => {
      clearBtn.classList.toggle("hidden", !input.value)
    })

    clearBtn.addEventListener("click", () => {

      isClearing = true

      input.value = "" // clear text
      clearBtn.classList.add("hidden") // hide clear button

      if (wasFocusedBeforeClear) {
        input.focus() // keep focus
        nav.classList.add("md:hidden")
        form.classList.add("flex-1")
        input.classList.remove("w-44")
        input.classList.add("w-full") // keep search expanded
      } else {
        if (window.innerWidth < 768) {

          form.classList.remove("flex-1")
          form.classList.add("hidden")

          hamburger?.classList.remove("hidden")
          logo?.classList.remove("hidden")
          mobileOpen?.classList.remove("hidden")

        } else {

          nav.classList.remove("md:hidden") // not focus + empty → collapse
          form.classList.remove("flex-1")
          input.classList.remove("w-full")
          input.classList.add("w-44")

        }
      }

    })

  }

  // ======================
  // ESC CLOSE
  // ======================

  document.addEventListener("keydown", (e) => {

    if (input && nav && form) {
      if (e.key === "Escape" && document.activeElement === input) {
        
        input.value = "" // clear text
        
        clearBtn?.classList.add("hidden") // hide clear button

        if (window.innerWidth >= 768) {

          nav.classList.remove("md:hidden")
          form.classList.remove("flex-1")
          input.classList.remove("w-full")
          input.classList.add("w-44") // collapse search

        } else {

          form.classList.add("hidden")

          hamburger?.classList.remove("hidden")
          logo?.classList.remove("hidden")
          mobileOpen?.classList.remove("hidden")

        }
        
        input.blur() // remove focus
      }
    }

  })

  // ======================
  // THEME TOGGLE
  // ======================
  const html = document.documentElement;
  const iconSun = document.getElementById("iconSun");
  const iconMoon = document.getElementById("iconMoon");

  const isDarkInit =
  localStorage.getItem("theme") === "dark"? true: localStorage.getItem("theme") === "light"? false: window.matchMedia("(prefers-color-scheme: dark)").matches;
  html.classList.toggle("dark", isDarkInit);
  iconSun?.classList.toggle("hidden", isDarkInit);
  iconMoon?.classList.toggle("hidden", !isDarkInit);

  document.getElementById("themeToggle")?.addEventListener("click", () => {
    const isDark = html.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    iconSun?.classList.toggle("hidden", isDark);
    iconMoon?.classList.toggle("hidden", !isDark);
  });

  // ======================
  // SCROLL
  // ======================
  let scrollTick = false

  window.addEventListener("scroll", () => {

    if (scrollTick) return
    scrollTick = true

    requestAnimationFrame(() => {

      scrollTick = false

      // HEADER SHADOW

      if (siteHeader) {
        if (window.scrollY > 8) {
          siteHeader.classList.add("shadow-sm")
        } else {
          siteHeader.classList.remove("shadow-sm")
        }
      }
      

      if (!input || !nav || !form) return

      // if (window.innerWidth < 768) return

      if (window.innerWidth < 768) {
        if (document.activeElement !== input && input.value === "") {
          
          form.classList.remove("flex-1")
          form.classList.add("hidden")

          hamburger?.classList.remove("hidden")
          logo?.classList.remove("hidden")
          mobileOpen?.classList.remove("hidden")

        }
      } else {
        
        // if (document.activeElement === input && input.value === "") { input.blur() } // focus + empty → remove focus
        if (document.activeElement !== input && input.value === "") {
          nav.classList.remove("md:hidden") // not focus + empty → collapse
          form.classList.remove("flex-1")
          input.classList.remove("w-full")
          input.classList.add("w-44")
        }
      }

    })
  })

  window.addEventListener("resize", () => {

    if (!form || !input) return

    if (window.innerWidth >= 768) {

      form.classList.remove("hidden")

      hamburger?.classList.remove("hidden")
      logo?.classList.remove("hidden")
      mobileOpen?.classList.remove("hidden")

      if (document.activeElement === input || input.value !== "") {
        nav.classList.add("md:hidden")
        form.classList.add("flex-1")
        input.classList.remove("w-44")
        input.classList.add("w-full") // keep search expanded
      } else {
        nav.classList.remove("md:hidden")
        form.classList.remove("flex-1")
        input.classList.remove("w-full")
        input.classList.add("w-44") // reset layout
      }

    } else {
      if (document.activeElement === input || input.value !== "") {

        form.classList.remove("hidden") // mobile search active
        form.classList.add("flex-1")

        input.classList.remove("w-44")
        input.classList.add("w-full")

        // hamburger?.classList.add("hidden")
        hamburger?.classList.remove("hidden")
        logo?.classList.add("hidden")
        mobileOpen?.classList.add("hidden")

      } else {

        form.classList.add("hidden") // mobile default header

        hamburger?.classList.remove("hidden")
        logo?.classList.remove("hidden")
        mobileOpen?.classList.remove("hidden")

      }

    }

  })

  // ======================
  // UI HELPERS
  // ======================

  // ======================
  // NAVIGATION
  // ======================
  // ======================
  // SIDEBAR
  // ======================
  const sidebar = document.getElementById("sidebar")
  const overlay = document.getElementById("sidebarOverlay")
  const sidebarClose = document.getElementById("sidebarClose")
  
  hamburger?.addEventListener("click", () => {

    if (sidebar?.classList.contains("-translate-x-full")) {

      sidebar?.classList.remove("-translate-x-full")
      sidebar?.classList.add("translate-x-0")

      overlay?.classList.remove("hidden")

      document.body.classList.add("overflow-hidden")

    } else {

      sidebar?.classList.remove("translate-x-0")
      sidebar?.classList.add("-translate-x-full")

      overlay?.classList.add("hidden")

      document.body.classList.remove("overflow-hidden")

    }

  })

  overlay?.addEventListener("click", () => {
    
    sidebar?.classList.remove("translate-x-0")
    sidebar?.classList.add("-translate-x-full")

    overlay?.classList.add("hidden")

    document.body.classList.remove("overflow-hidden")

  })

  sidebarClose?.addEventListener("click", () => {

    sidebar?.classList.remove("translate-x-0")
    sidebar?.classList.add("-translate-x-full")

    overlay?.classList.add("hidden")

    document.body.classList.remove("overflow-hidden")

  })

  document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {
      
      sidebar?.classList.remove("translate-x-0")
      sidebar?.classList.add("-translate-x-full")

      overlay?.classList.add("hidden")

      document.body.classList.remove("overflow-hidden")
    }

  })


  // ======================
  // PAGE FEATURES
  // ======================

  // ======================
  // COPY LINK
  // ======================

  window.copyLink = function(btn){

    navigator.clipboard.writeText(window.location.href)

    const tip = btn.querySelector(".copy-tooltip")
    if(!tip) return

    btn.classList.add("copied")

    tip.classList.remove("opacity-0")

    setTimeout(()=>{

      tip.classList.add("opacity-0")

      btn.classList.remove("copied")

    },1500)

  }

  // ======================
  // READING PROGRESS
  // ======================

  const progressBar = document.getElementById("reading-progress")
  const article = document.querySelector("article")

  if (progressBar && article) {

    let progressTick = false

    const updateProgress = () => {

      progressTick = false

      const totalHeight = article.scrollHeight - window.innerHeight
      const progress = Math.min(100, (window.scrollY / totalHeight) * 100)

      progressBar.style.width = progress + "%"

    }

    window.addEventListener("scroll", () => {

      if (progressTick) return
      progressTick = true

      requestAnimationFrame(updateProgress)

    })

  }
})