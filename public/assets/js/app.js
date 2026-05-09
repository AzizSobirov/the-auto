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

// Header
const header = document.querySelector('.header')
if (header) {
  const burger = header.querySelector('.header__burger')

  burger?.addEventListener('click', () => {
    header.classList.toggle('header--open')
    if (header.classList.contains('header--open')) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  })

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('header--scrolled')
    } else {
      header.classList.remove('header--scrolled')
    }
  })
}

// Footer
const currentYear = document.getElementById('current-year')
if (currentYear) {
  currentYear.textContent = new Date().getFullYear()
}

// Swiper
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
