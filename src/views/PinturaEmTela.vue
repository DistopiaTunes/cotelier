<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'

const headerVisible = ref(false)
const mobileMenuOpen = ref(false)

const waPintura =
  'https://wa.me/554130492413?text=' +
  encodeURIComponent(
    'Olá! Gostaria de informações sobre o curso de Pintura em Tela no Cotelier'
  )

const horarios = [
  {
    dia: 'Terça-feira',
    faixa: '14h às 15h30',
    publico: 'A partir de 12 anos',
  },
  {
    dia: 'Terça-feira',
    faixa: '16h às 17h30',
    publico: 'De 8 a 11 anos',
  },
  {
    dia: 'Quarta-feira',
    faixa: '8h às 9h30',
    publico: 'A partir de 12 anos',
  },
  {
    dia: 'Quarta-feira',
    faixa: '14h às 15h30',
    publico: 'De 8 a 11 anos',
  },
  {
    dia: 'Quarta-feira',
    faixa: '16h às 17h30',
    publico: 'A partir de 12 anos',
  },
]

const checkHeaderVisibility = () => {
  const hero = document.querySelector('header')
  if (hero) {
    const heroBottom = hero.offsetTop + hero.offsetHeight
    headerVisible.value = window.scrollY > heroBottom
  }
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

onMounted(() => {
  window.addEventListener('scroll', checkHeaderVisibility)
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkHeaderVisibility)
})
</script>

<template>
  <div class="bg-stone-50">
    <nav
      class="fixed top-0 left-0 right-0 z-50 transition-transform duration-300"
      :class="{ '-translate-y-full': !headerVisible }"
      :style="{ transform: headerVisible ? 'translateY(0)' : 'translateY(-100%)' }"
    >
      <div class="bg-white/90 backdrop-blur-sm shadow-md">
        <div class="max-w-6xl mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <RouterLink to="/" class="font-lora text-2xl text-stone-800">Cotelier</RouterLink>

            <div class="hidden md:flex items-center gap-8">
              <a href="#curso" class="font-lora text-stone-600 hover:text-stone-900">Curso</a>
              <a href="#horarios" class="font-lora text-stone-600 hover:text-stone-900">Horários</a>
              <a href="#visitar" class="font-lora text-stone-600 hover:text-stone-900">Visite-nos</a>
              <RouterLink to="/" class="font-lora text-stone-500 hover:text-stone-800 text-sm"
                >Site completo</RouterLink
              >
            </div>

            <button class="md:hidden p-2" type="button" @click="toggleMobileMenu">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-stone-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  v-if="!mobileMenuOpen"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
                <path
                  v-else
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div v-if="mobileMenuOpen" class="md:hidden pt-4 pb-2">
            <div class="flex flex-col space-y-3">
              <a href="#curso" class="font-lora text-stone-600 hover:text-stone-900" @click="toggleMobileMenu"
                >Curso</a
              >
              <a
                href="#horarios"
                class="font-lora text-stone-600 hover:text-stone-900"
                @click="toggleMobileMenu"
                >Horários</a
              >
              <a href="#visitar" class="font-lora text-stone-600 hover:text-stone-900" @click="toggleMobileMenu"
                >Visite-nos</a
              >
              <RouterLink
                to="/"
                class="font-lora text-stone-500 hover:text-stone-800"
                @click="toggleMobileMenu"
                >Site completo</RouterLink
              >
            </div>
          </div>
        </div>
      </div>
    </nav>

    <header class="min-h-screen relative flex flex-col items-center justify-center gap-6 px-4">
      <div class="absolute inset-0 bg-[url('/src/assets/img/bg.jpg')] bg-cover bg-center opacity-50"></div>
      <div class="relative z-10 text-center px-4 bg-white/45 backdrop-blur-sm rounded-lg p-8 max-w-3xl w-full mx-4">
        <h1
          class="font-lora text-4xl sm:text-6xl md:text-7xl text-stone-900 mb-4 [text-shadow:_0_10px_20px_rgb(255,255,255)]"
        >
          Pintura em tela
        </h1>
        <p class="font-lora text-lg md:text-2xl text-stone-700 [text-shadow:_0_0_35px_rgb(255,255,255)]">
          Venha aprender a pintar com a gente!
        </p>
      </div>
      <a
        :href="waPintura"
        target="_blank"
        rel="noopener noreferrer"
        class="relative z-10 inline-flex items-center justify-center gap-2 bg-green-500/90 hover:bg-green-600/90 text-white font-lora text-base md:text-lg px-8 py-3.5 rounded-full shadow-[0_6px_22px_rgba(28,25,23,0.28),0_2px_10px_rgba(28,25,23,0.22)] transition-colors"
      >
        <svg class="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
          />
        </svg>
       Agende sua aula experimental gratuitamente!
      </a>
    </header>

    <section id="curso" class="bg-stone-100 py-20 px-4 md:px-8">
      <div class="max-w-4xl mx-auto">
        <h2 class="font-lora text-4xl md:text-5xl text-center mb-12 text-stone-800">Sobre o curso</h2>
        <div class="space-y-6">
          <p class="font-lora text-xl text-stone-600 leading-relaxed text-justify">
            A oficina livre de <strong>desenho artístico e pintura em tela</strong> é pensada para quem está começando
            ou quer aprofundar bases sólidas: composição, luz e sombra, proporção, observação e
            <strong>teoria das cores</strong>, sempre com acompanhamento próximo em um ambiente acolhedor.
          </p>
          <p class="font-lora text-xl text-stone-600 leading-relaxed text-justify">
            Você desenvolve seu próprio projeto ao longo dos encontros, experimentando materiais e técnicas com tempo
            para pesquisar, errar e evoluir — no espírito colaborativo do Cotelier.
          </p>
          <div class="flex flex-wrap gap-4 justify-center pt-4">
            <a
              :href="waPintura"
              target="_blank"
              rel="noopener noreferrer"
              class="bg-green-500/80 hover:bg-green-600/80 text-white px-6 py-3 rounded-lg flex items-center justify-center text-base font-lora"
            >
              <svg class="w-5 h-5 mr-2 shrink-0" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                />
              </svg>
              Agende uma aula experimental
            </a>
          </div>
        </div>
      </div>
    </section>

    <section id="horarios" class="py-20 px-4 md:px-8 bg-white">
      <div class="max-w-3xl mx-auto">
        <h2 class="font-lora text-4xl md:text-5xl text-center mb-4 text-stone-800">Horários</h2>
        <p class="font-lora text-lg text-stone-600 text-center mb-12 max-w-2xl mx-auto">
          Turmas da oficina livre de desenho artístico e pintura em tela (consulte vagas pelo WhatsApp).
        </p>

        <div class="space-y-6">
          <div v-for="(h, i) in horarios" :key="i">
            <p
              v-if="i === 0 || horarios[i - 1].dia !== h.dia"
              class="text-xl text-stone-700 text-center font-lora mb-4"
              :class="{ 'mt-8': i > 0 }"
            >
              {{ h.dia }}
            </p>
            <div class="bg-stone-50 border border-stone-200 p-6 rounded-lg shadow-sm">
              <div class="flex flex-wrap items-start justify-between gap-2 mb-2">
                <h3 class="font-lora text-xl text-stone-800">Pintura em tela</h3>
                <span class="text-sm font-lora text-blue-600 flex items-center gap-1 shrink-0">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Disponível
                </span>
              </div>
              <p class="font-lora text-lg text-stone-600 mb-1">
                <span class="font-semibold">{{ h.faixa }}</span>
              </p>
              <p class="font-lora text-stone-500">{{ h.publico }}</p>
            </div>
          </div>
        </div>

        <p class="font-lora text-center text-stone-500 text-sm mt-10">
          Horários também disponíveis na
          <RouterLink to="/#schedule" class="text-stone-700 underline hover:text-stone-900"
            >página principal</RouterLink
          >.
        </p>
      </div>
    </section>

    <section id="visitar" class="py-20 px-4 md:px-8 bg-stone-100">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="font-lora text-4xl md:text-5xl mb-8 text-stone-800">Venha nos visitar</h2>
        <p class="font-lora text-xl md:text-2xl text-stone-600 mb-8">
          Rua Carlos Garibaldi Biazetto, 220<br />
          Boa Vista, Curitiba - PR<br />
        </p>

        <div
          class="flex flex-col sm:flex-row justify-center items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 mb-12"
        >
          <a
            href="https://wa.me/554130492413"
            target="_blank"
            rel="noopener noreferrer"
            class="bg-green-500/80 hover:bg-green-600/80 text-white px-6 py-2 rounded-lg flex items-center justify-center text-sm w-36"
          >
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
              />
            </svg>
            WhatsApp
          </a>
          <a
            href="https://instagram.com/cotelier.oficial"
            target="_blank"
            rel="noopener noreferrer"
            class="bg-pink-600/80 hover:bg-pink-700/80 text-white px-6 py-2 rounded-lg flex items-center justify-center text-sm w-36"
          >
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
              />
            </svg>
            Instagram
          </a>
        </div>

        <div class="w-full h-96 mb-8 rounded-lg overflow-hidden shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3603.0374531294384!2d-49.25659492374376!3d-25.41145673799271!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94dce67da12fffff%3A0x89c7c7e11b8afd7e!2sR.%20Carlos%20Garibaldi%20Biazetto%2C%20220%20-%20Boa%20Vista%2C%20Curitiba%20-%20PR%2C%2082560-480!5e0!3m2!1spt-BR!2sbr!4v1704334040345!5m2!1spt-BR!2sbr"
            width="100%"
            height="100%"
            style="border: 0"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Mapa do Cotelier"
          ></iframe>
        </div>
      </div>
    </section>

    <footer class="bg-stone-900 text-stone-300 py-8">
      <div class="text-center font-cormorant px-4">
        <p>&copy; 2026 Cotelier. Todos os direitos reservados.</p>
        <p class="text-sm mt-2">
          <RouterLink to="/" class="underline hover:text-white">Voltar ao site</RouterLink>
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.font-lora {
  font-family: 'Lora', serif;
}
.font-cormorant {
  font-family: 'Cormorant Garamond', serif;
}
</style>
