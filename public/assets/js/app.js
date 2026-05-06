// modal
const modal = {
  el: document.querySelector('.modal-overlay'),
  activeModal: null,

  init() {
    this.setupTriggers()
    this.setupOutsideClick()
  },

  setupTriggers() {
    const triggers = document.querySelectorAll('[data-modal]')
    triggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const modalName = trigger.dataset.modal
        if (modalName === 'close') {
          this.close()
        } else {
          this.open(modalName)
        }
      })
    })
  },

  setupOutsideClick() {
    this.el.addEventListener('click', (event) => {
      if (event.target === this.el) {
        this.close()
      }
    })
  },

  open(name) {
    const targetModal = this.el.querySelector(`[data-template="${name}"]`)

    if (targetModal) {
      this.close(true) // Close any currently active modal
      this.activeModal = targetModal

      this.el.style.display = 'flex' // Show the overlay
      requestAnimationFrame(() => {
        this.el.classList.add('show') // Animate overlay
        this.activeModal.style.display = 'flex' // Show modal content

        // Add animation class to modal content
        requestAnimationFrame(() => {
          this.activeModal.classList.add('show')
        })
      })
    } else {
      console.error(`Modal with name "${name}" not found.`)
    }
  },

  close(onlyModal = false) {
    if (onlyModal) {
      if (this.activeModal) {
        this.activeModal.style.display = 'none' // Fully hide modal content
        this.activeModal.classList.remove('show') // Hide modal content
      }
    } else {
      if (this.activeModal) {
        this.activeModal.classList.remove('show') // Hide modal content
        const modalToHide = this.activeModal // Preserve reference for timeout
        this.activeModal = null

        setTimeout(() => {
          modalToHide.style.display = 'none' // Fully hide after animation
        }, 250) // Match the CSS animation duration
      }

      this.el.classList.remove('show') // Animate overlay
      this.el.addEventListener(
        'transitionend',
        () => {
          if (!this.el.classList.contains('show')) {
            this.el.style.display = 'none' // Fully hide overlay
          }
        },
        { once: true },
      )
    }
  },
}
modal.init()

// Header & Sidebar
const header = document.querySelector('.header')
const sidebar = document.querySelector('.sidebar')
const burgerOpen = document.querySelector('.header__burger-open')
const burgerClose = document.querySelector('.header__burger-close')
const sidebarMenu = document.querySelector('.sidebar__menu')

if (header && sidebar && burgerOpen && burgerClose && sidebarMenu) {
  const menu = header.querySelector('.menu')
  if (menu) {
    sidebarMenu.innerHTML = menu.outerHTML

    // Setup mobile sub-menu toggles
    const mobileHasChildren = sidebarMenu.querySelectorAll(
      '.menu-item-has-children',
    )
    mobileHasChildren.forEach((item) => {
      const link = item.querySelector('a')
      if (link) {
        link.addEventListener('click', (e) => {
          if (window.innerWidth <= 1024) {
            e.preventDefault()
            item.classList.toggle('is-active')
          }
        })
      }
    })
  }

  const toggleMenu = (open) => {
    header.classList.toggle('is-menu-open', open)
    sidebar.classList.toggle('active', open)
    document.body.style.overflow = open ? 'hidden' : ''
  }

  burgerOpen.addEventListener('click', () => toggleMenu(true))
  burgerClose.addEventListener('click', () => toggleMenu(false))

  // Close sidebar on link click
  const sidebarLinks = sidebar.querySelectorAll('a')
  sidebarLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      if (!link.parentElement.classList.contains('menu-item-has-children')) {
        toggleMenu(false)
      }
    })
  })
}

// services
const servicesEl = document.querySelector('.services')
if (servicesEl) {
  const animateCount = (el) => {
    const target = parseInt(el.getAttribute('data-count') || '0')
    const suffix = el.getAttribute('data-suffix') || ''
    const duration = 2000
    const start = 0
    const startTime = performance.now()

    const update = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function: easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)

      const current = Math.floor(ease * (target - start) + start)
      el.textContent = current.toLocaleString() + suffix

      if (progress < 1) {
        requestAnimationFrame(update)
      }
    }

    requestAnimationFrame(update)
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target)
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.5 },
  )

  servicesEl.querySelectorAll('.services__stat-value').forEach((el) => {
    observer.observe(el)
  })
}

// news
const newsEl = document.querySelector('.news')
if (newsEl) {
  const desktopFilters = newsEl.querySelectorAll('.filter-item')
  const mobileFilters = newsEl.querySelectorAll(
    '.news__filter-swiper .swiper-slide',
  )
  const cards = newsEl.querySelectorAll('.news-card')

  const filterNews = (category) => {
    // Update active states
    const allFilters = [...desktopFilters, ...mobileFilters]
    allFilters.forEach((f) => {
      if (f.dataset.filter === category) {
        f.classList.add('is-active')
      } else {
        f.classList.remove('is-active')
      }
    })

    // Filter cards
    let visibleCount = 0
    cards.forEach((card) => {
      if (category === 'all' || card.dataset.category === category) {
        card.style.display = 'block'
        visibleCount++
        requestAnimationFrame(() => {
          card.style.opacity = '1'
          card.style.transform = 'translateY(0)'
        })
      } else {
        card.style.opacity = '0'
        card.style.transform = 'translateY(20px)'
        setTimeout(() => {
          card.style.display = 'none'
        }, 300)
      }
    })

    // Handle empty state
    const emptyMsg = newsEl.querySelector('.news__empty')
    if (emptyMsg) {
      if (visibleCount === 0) {
        emptyMsg.style.display = 'block'
        requestAnimationFrame(() => {
          emptyMsg.style.opacity = '1'
        })
      } else {
        emptyMsg.style.opacity = '0'
        emptyMsg.style.display = 'none'
      }
    }
  }

  desktopFilters.forEach((filter) => {
    filter.addEventListener('click', () => {
      filterNews(filter.dataset.filter)
    })
  })

  mobileFilters.forEach((filter) => {
    filter.addEventListener('click', () => {
      filterNews(filter.dataset.filter)
    })
  })
}

// projects
const projectsEl = document.querySelector('.projects')
if (projectsEl) {
  const desktopFilters = projectsEl.querySelectorAll('.filter-item')
  const mobileFilters = projectsEl.querySelectorAll(
    '.projects__filter-swiper .swiper-slide',
  )
  const cards = projectsEl.querySelectorAll('.project-card-wrapper')

  const filterProjects = (category) => {
    // Update active states
    const allFilters = [...desktopFilters, ...mobileFilters]
    allFilters.forEach((f) => {
      if (f.dataset.filter === category) {
        f.classList.add('is-active')
      } else {
        f.classList.remove('is-active')
      }
    })

    // Filter cards
    let visibleCount = 0
    cards.forEach((card) => {
      if (category === 'all' || card.dataset.category === category) {
        card.style.display = 'block'
        visibleCount++
        requestAnimationFrame(() => {
          card.style.opacity = '1'
          card.style.transform = 'translateY(0)'
        })
      } else {
        card.style.opacity = '0'
        card.style.transform = 'translateY(20px)'
        setTimeout(() => {
          card.style.display = 'none'
        }, 300)
      }
    })

    // Handle empty state
    const emptyMsg = projectsEl.querySelector('.projects__empty')
    if (emptyMsg) {
      if (visibleCount === 0) {
        emptyMsg.style.display = 'block'
        requestAnimationFrame(() => {
          emptyMsg.style.opacity = '1'
        })
      } else {
        emptyMsg.style.opacity = '0'
        emptyMsg.style.display = 'none'
      }
    }
  }

  desktopFilters.forEach((filter) => {
    filter.addEventListener('click', () => {
      filterProjects(filter.dataset.filter)
    })
  })

  mobileFilters.forEach((filter) => {
    filter.addEventListener('click', () => {
      filterProjects(filter.dataset.filter)
    })
  })
}

// service
const serviceEl = document.querySelector('.service')
if (serviceEl) {
  // Accordions
  const serviceItems = serviceEl.querySelectorAll('.service-item')
  serviceItems.forEach((item) => {
    const header = item.querySelector('.service-item__header')
    const body = item.querySelector('.service-item__body')

    if (header) {
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('is-active')

        // Close others
        serviceItems.forEach((other) => {
          if (other !== item) {
            other.classList.remove('is-active')
            const otherBody = other.querySelector('.service-item__body')
            if (otherBody) otherBody.style.maxHeight = '0'
          }
        })

        // Toggle current
        if (isActive) {
          item.classList.remove('is-active')
          if (body) body.style.maxHeight = '0'
        } else {
          item.classList.add('is-active')
          if (body) body.style.maxHeight = body.scrollHeight + 'px'
        }
      })
    }
  })

  // Scroll Navigation
  const navItems = serviceEl.querySelectorAll('[data-nav-item]')
  const sections = serviceEl.querySelectorAll('.service-block')

  const updateActiveNav = (id) => {
    navItems.forEach((nav) => {
      const href = nav.getAttribute('href')
      if (href === `#${id}`) {
        nav.classList.add('is-active')
      } else {
        nav.classList.remove('is-active')
      }
    })
  }

  // Smooth scroll
  navItems.forEach((nav) => {
    nav.addEventListener('click', (e) => {
      e.preventDefault()
      const id = nav.getAttribute('href').substring(1)
      const target = document.getElementById(id)
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 100,
          behavior: 'smooth',
        })
      }
    })
  })

  // Intersection Observer for scroll tracking
  const observerOptions = {
    root: null,
    rootMargin: '-10% 0px -80% 0px',
    threshold: 0,
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        updateActiveNav(entry.target.id)
      }
    })
  }, observerOptions)

  sections.forEach((section) => observer.observe(section))
}

// project
const projectEl = document.querySelector('.project')
if (projectEl) {
  // Scroll Navigation
  const navItems = projectEl.querySelectorAll('[data-nav-item]')
  const sections = projectEl.querySelectorAll('.project-block')

  const updateActiveNav = (id) => {
    navItems.forEach((nav) => {
      const href = nav.getAttribute('href')
      if (href === `#${id}`) {
        nav.classList.add('is-active')
      } else {
        nav.classList.remove('is-active')
      }
    })
  }

  // Smooth scroll
  navItems.forEach((nav) => {
    nav.addEventListener('click', (e) => {
      e.preventDefault()
      const id = nav.getAttribute('href').substring(1)
      const target = document.getElementById(id)
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 100,
          behavior: 'smooth',
        })
      }
    })
  })

  // Intersection Observer for scroll tracking
  const observerOptions = {
    root: null,
    rootMargin: '-10% 0px -80% 0px',
    threshold: 0,
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        updateActiveNav(entry.target.id)
      }
    })
  }, observerOptions)

  sections.forEach((section) => observer.observe(section))
}

// team
const teamEl = document.querySelector('.team')
if (teamEl) {
  // Scroll Navigation
  const navItems = teamEl.querySelectorAll('[data-nav-item]')
  const sections = teamEl.querySelectorAll('.team-block')

  const updateActiveNav = (id) => {
    navItems.forEach((nav) => {
      const href = nav.getAttribute('href')
      if (href === `#${id}`) {
        nav.classList.add('is-active')
      } else {
        nav.classList.remove('is-active')
      }
    })
  }

  // Smooth scroll
  navItems.forEach((nav) => {
    nav.addEventListener('click', (e) => {
      e.preventDefault()
      const id = nav.getAttribute('href').substring(1)
      const target = document.getElementById(id)
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 100,
          behavior: 'smooth',
        })
      }
    })
  })

  // Intersection Observer for scroll tracking
  const observerOptions = {
    root: null,
    rootMargin: '-10% 0px -80% 0px',
    threshold: 0,
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        updateActiveNav(entry.target.id)
      }
    })
  }, observerOptions)

  sections.forEach((section) => observer.observe(section))
}

// reviews list
const reviewsList = document.querySelector('.reviews-list')
if (reviewsList) {
  // Reviews List Show More
  const reviewsListWrapper = document.querySelector(
    '.reviews-list__cards .wrapper',
  )
  const reviewsShowMoreBtn = document.querySelector(
    '.reviews-list__cards-footer button',
  )

  if (reviewsListWrapper && reviewsShowMoreBtn) {
    const cards = Array.from(
      reviewsListWrapper.querySelectorAll('.review-card'),
    )
    const initialCount = 6
    const loadCount = 3
    let currentVisible = initialCount

    // Initially hide cards beyond initialCount
    cards.forEach((card, index) => {
      if (index >= initialCount) {
        card.style.display = 'none'
      }
    })

    // Hide button if we don't have more than initialCount cards
    if (cards.length <= initialCount) {
      reviewsShowMoreBtn.parentElement.style.display = 'none'
    }

    reviewsShowMoreBtn.addEventListener('click', () => {
      const nextVisible = currentVisible + loadCount

      // Show next batch
      cards.forEach((card, index) => {
        if (index >= currentVisible && index < nextVisible) {
          card.style.display = 'flex' // The review-card usually has display: flex
        }
      })

      currentVisible = nextVisible

      // Hide button if all cards are shown
      if (currentVisible >= cards.length) {
        reviewsShowMoreBtn.parentElement.style.display = 'none'
      }
    })
  }
}

// Footer
const currentYear = document.getElementById('current-year')
if (currentYear) {
  currentYear.textContent = new Date().getFullYear()
}

// Swiper
let servicesAdvantagesSwiper = new Swiper('.services__advantages .swiper', {
  slidesPerView: 'auto',
  spaceBetween: 12,
  breakpoints: {
    1280: {
      slidesPerView: 4,
      spaceBetween: 12,
    },
  },
})

let stepsSwiper = new Swiper('.steps .swiper', {
  slidesPerView: 'auto',
  spaceBetween: 12,
  breakpoints: {
    1025: {
      slidesPerView: 2,
      spaceBetween: 12,
    },
  },
})

let topnewsSwiper = new Swiper('.topnews .swiper', {
  slidesPerView: 'auto',
  spaceBetween: 12,
  breakpoints: {
    1025: {
      slidesPerView: 3,
      spaceBetween: 12,
    },
    1280: {
      slidesPerView: 4,
      spaceBetween: 12,
    },
  },
})

let topservicesSwiper = new Swiper('.topservices .swiper', {
  slidesPerView: 'auto',
  spaceBetween: 12,
  breakpoints: {
    1025: {
      slidesPerView: 3,
      spaceBetween: 12,
    },
    1280: {
      slidesPerView: 3,
      spaceBetween: 12,
    },
  },
})

let reviewsGeneralSwiper = new Swiper('.reviews__general .swiper', {
  slidesPerView: 'auto',
  spaceBetween: 12,
  watchSlidesProgress: true,
  breakpoints: {
    640: {
      slidesPerView: 2,
      spaceBetween: 12,
    },
    1025: {
      slidesPerView: 3,
      spaceBetween: 12,
    },
    1280: {
      slidesPerView: 4,
      spaceBetween: 12,
    },
  },
})

let reviewsMapSwiper = new Swiper('.reviews__map .swiper', {
  slidesPerView: 'auto',
  spaceBetween: 12,
  watchSlidesProgress: true,
  breakpoints: {
    1025: {
      slidesPerView: 2,
      spaceBetween: 12,
    },
    1280: {
      slidesPerView: 3,
      spaceBetween: 12,
    },
  },
})

let reviewsGallerySwiper = new Swiper('.reviews-list__gallery .swiper', {
  slidesPerView: 1,
  spaceBetween: 12,
  watchSlidesProgress: true,
  breakpoints: {
    1025: {
      slidesPerView: 3,
      spaceBetween: 12,
    },
    1280: {
      slidesPerView: 4,
      spaceBetween: 12,
    },
  },
})

let newsFilterSwiper = new Swiper('.news__filter-swiper', {
  slidesPerView: 'auto',
  spaceBetween: 8,
})

let projectsFilterSwiper = new Swiper('.projects__filter-swiper', {
  slidesPerView: 'auto',
  spaceBetween: 8,
})

let serviceFilterSwiper = new Swiper('.service__filter-swiper', {
  slidesPerView: 'auto',
  spaceBetween: 8,
})

let projectFilterSwiper = new Swiper('.project__filter-swiper', {
  slidesPerView: 'auto',
  spaceBetween: 8,
})

let teamFilterSwiper = new Swiper('.team__filter-swiper', {
  slidesPerView: 'auto',
  spaceBetween: 8,
})

let teamLawyersSwiper = new Swiper('.team__lawyers-swiper .swiper', {
  slidesPerView: 'auto',
  spaceBetween: 12,
  watchSlidesProgress: true,
  breakpoints: {
    640: {
      slidesPerView: 2,
    },
    1025: {
      slidesPerView: 3,
    },
  },
})

let postGallerySwiper = new Swiper('.post__gallery', {
  slidesPerView: 1,
  spaceBetween: 0,
  loop: true,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
})

// Initialize the fancybox
const fancyboxTriggers = Array.from(
  document.querySelectorAll('[data-fancybox]'),
).filter((trigger) => trigger.dataset.fancybox)
if (fancyboxTriggers) {
  const fancyboxInstances = []
  fancyboxTriggers.forEach((trigger) => {
    const name = trigger.dataset.fancybox
    if (fancyboxInstances.includes(name)) {
      return // Skip if already bound
    }
    // Add the name to the `fancyboxInstances` list
    fancyboxInstances.push(name)
  })
  fancyboxInstances.forEach((name) => {
    Fancybox.bind(`[data-fancybox="${name}"]`, {
      Images: { Panzoom: { maxScale: 3 } },
    })
  })
}

// init phone mask
const phoneMasks = document.querySelectorAll("input[name='phone']")
phoneMasks.forEach((input) => {
  let keyCode
  function mask(event) {
    event.keyCode && (keyCode = event.keyCode)
    let pos = this.selectionStart
    if (pos < 3) event.preventDefault()
    let matrix = '+7 (___) ___-__-__',
      i = 0,
      def = matrix.replace(/\D/g, ''),
      val = this.value.replace(/\D/g, ''),
      newValue = matrix.replace(/[_\d]/g, function (a) {
        return i < val.length ? val.charAt(i++) || def.charAt(i) : a
      })
    i = newValue.indexOf('_')
    if (i != -1) {
      i < 5 && (i = 3)
      newValue = newValue.slice(0, i)
    }
    let reg = matrix
      .substr(0, this.value.length)
      .replace(/_+/g, function (a) {
        return '\\d{1,' + a.length + '}'
      })
      .replace(/[+()]/g, '\\$&')
    reg = new RegExp('^' + reg + '$')
    if (
      !reg.test(this.value) ||
      this.value.length < 5 ||
      (keyCode > 47 && keyCode < 58)
    )
      this.value = newValue
    if (event.type == 'blur' && this.value.length < 5) this.value = ''

    if (this.value.length == 18 || this.value.length == 0) {
      input.dataset.numbervalid = 'true'
    } else {
      input.dataset.numbervalid = 'false'
    }
  }

  input.addEventListener('input', mask, false)
  input.addEventListener('focus', mask, false)
  input.addEventListener('blur', mask, false)
  input.addEventListener('keydown', mask, false)
})

// form
function successSend() {
  modal.open('success')

  setTimeout(() => {
    modal.close()
  }, 3000)
}

const forms = document.querySelectorAll('.the-form')
forms.forEach((form) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    successSend()
  })
})
