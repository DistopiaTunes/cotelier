<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

const currentSlide = ref(0);
let slider = null;
let slides = 0;
let interval = null;

// Add state for gallery modal
const showModal = ref(false);
const currentGallery = ref([]);
const galleryTitle = ref('');
const currentImageIndex = ref(0);
const showFullImage = ref(false);
// Add state for gallery scroll position
const galleryScrollPosition = ref(0);

// Add state for teacher bio modal
const showBioModal = ref(false);
const currentTeacher = ref(null);

// Add these refs after the other refs
const headerVisible = ref(false);
const headerHeight = ref(0);

// Add this ref with the other refs
const mobileMenuOpen = ref(false);

// Add state for workshop dialog
const showWorkshopDialog = ref(false);
const currentWorkshopIndex = ref(0);

// Workshops data
const workshops = [
    {
        title: 'Nova Oficina de Artes',
        image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f',
        description: 'Descubra sua criatividade em nossa nova oficina de artes! Uma experiência única para explorar diferentes técnicas e expressar sua arte.',
        details: 'Venha participar de uma oficina especial onde você poderá experimentar diversas técnicas artísticas, desde pintura até desenho, em um ambiente acolhedor e inspirador.',
        additionalInfo: 'Não é necessário ter experiência prévia. Todos são bem-vindos!',
        whatsappMessage: 'Olá! Gostaria de informações sobre a Nova Oficina de Artes',
        instagramLink: 'https://instagram.com/cotelier.oficial'
    },
    {
        title: 'Oficina de Pintura em Aquarela',
        image: 'https://images.unsplash.com/photo-1515169067868-5387ec356754',
        description: 'Aprenda as técnicas fundamentais da pintura em aquarela com nossa oficina especializada.',
        details: 'Nesta oficina você aprenderá desde os básicos até técnicas avançadas de aquarela, explorando cores, texturas e diferentes estilos artísticos.',
        additionalInfo: 'Materiais inclusos. Vagas limitadas!',
        whatsappMessage: 'Olá! Gostaria de informações sobre a Oficina de Pintura em Aquarela',
        instagramLink: 'https://instagram.com/cotelier.oficial'
    },
    {
        title: 'Workshop de Desenho Realista',
        image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b',
        description: 'Desenvolva suas habilidades de desenho realista com técnicas profissionais.',
        details: 'Aprenda a criar desenhos realistas impressionantes através de técnicas de sombreamento, proporção e detalhamento.',
        additionalInfo: 'Ideal para iniciantes e intermediários que desejam aprimorar suas técnicas.',
        whatsappMessage: 'Olá! Gostaria de informações sobre o Workshop de Desenho Realista',
        instagramLink: 'https://instagram.com/cotelier.oficial'
    }
];

const teachers = {
    1: {
        name: 'Márcia Espíndola',
        role: 'Idealizadora do Cotelier, Artista e Professora de Pintura',
        bio: 'Com mais de 20 anos de experiência, Márcia especializa-se em técnicas clássicas de pintura a óleo. Com abordagem acessível e inclusiva...',
        fullBio: 'Com mais de 20 anos de experiência, Márcia especializa-se em técnicas clássicas de pintura a óleo. Com abordagem acessível e inclusiva, Márcia busca inspirar e capacitar artistas de todos os níveis e idades.',
        image: 'https://images.unsplash.com/photo-1444464666168-49d633b86797',
        instagram: 'https://instagram.com/marciaespindolame',
        instagramLabel: '@marciaespindolame'
    },
    2: {
        name: 'Raphael Francisco', 
        role: 'Artista multidisciplinar',
        bio: 'Raphael é mestre em pintura pela UNESPAR, com mais de 10 anos de experiência na prática e ensino das artes visuais. Sua abordagem foca...',
        fullBio: 'Raphael é mestre em pintura pela UNESPAR, com mais de 10 anos de experiência na prática e ensino das artes visuais. Sua abordagem foca a exploração de diferentes técnicas e materiais, buscando sempre o equilíbrio entre as técnicas tradicionais e as práticas contemporâneas. Busca sempre a melhoria contínua e a inovação na arte. Adiciona uma perspectiva contemporânea e inovadora às suas obras, explorando a arte contemporânea e a arte digital.',
        image: 'https://striocks-phiod-kriuwn.yolasite.com/ws/alt-imgs/w400/9d3441fd4dc0825375ae921c8aa14a3b.webp',
        instagram: 'https://instagram.com/raphael.ars',
        instagramLabel: '@raphael.ars'
    },
    3: {
        name: 'Mônica Ohana',
        role: 'Artista plástica, tatuadora e professora',
        bio: 'Mônica Ohana é uma artista plástica, tatuadora e professora de artes visuais. Sua abordagem é contemporânea e inovadora...',
        fullBio: 'Mônica Ohana é uma artista plástica, tatuadora e professora de artes visuais. Sua abordagem é contemporânea e inovadora, buscando sempre o equilíbrio entre as técnicas tradicionais e as práticas contemporâneas.',
        image: 'https://striocks-phiod-kriuwn.yolasite.com/ws/alt-imgs/w400/c16dd131b965bd3801c90ddc01ec4047.webp',
        instagram: 'https://instagram.com/monicatatuadora',
        instagramLabel: '@monicatatuadora'
    },

    4: {
        name: 'Carlos Alexandre',
        role: 'Desenhista, Ilustrador, caricaturista e professor',
        bio: 'Carlos Alexandre é desenhista, ilustrador, caricaturista e professor. Atua há anos no universo das artes gráficas, desenvolvendo trabalhos originais que unem criatividade e senso de humor únicos.',
        fullBio: 'Carlos Alexandre é desenhista, ilustrador, caricaturista e professor, com uma vasta experiência na área de artes visuais. Já participou de diversas exposições e eventos culturais, transmitindo paixão e técnica em seus trabalhos e aulas. Com um olhar atento ao cotidiano, transforma cenas comuns em ilustrações expressivas e cheias de personalidade, encantando públicos de todas as idades. Ao longo dos anos, tem se dedicado também à formação de novos artistas, incentivando a criatividade e o pensamento crítico.',
        image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308',
        instagram: 'https://instagram.com/ilustracaricaturas_',
        instagramLabel: '@ilustracaricaturas_/'
    },

    5: {
        name: 'Alessa Souza',
        role: 'Desenhista, Ilustradora, e professora',
        bio: 'Alessa Souza cria ilustrações delicadas e cheias de poesia, trazendo leveza e sensibilidade para cada traço. Como ilustradora e professora, busca inspirar seus alunos a encontrarem beleza nos pequenos detalhes do cotidiano.',
        fullBio: 'Alessa Souza é desenhista, ilustradora e professora, dedicada a cultivar a criatividade por meio de desenhos suaves e expressivos. Sua trajetória é marcada pela busca por inspiração em momentos simples e na natureza, transmitindo emoções e sonhos através de suas obras. Alessa conduz suas aulas de modo gentil, incentivando cada aluno a desenvolver sua própria voz artística, com olhar atento à harmonia e à sutileza das cores e formas. As ilustrações que cria são reconhecidas por despertar sensações de aconchego, imaginação e encantamento em quem as aprecia.',
        image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308',
        instagram: 'https://instagram.com/ilustracaricaturas_',
        instagramLabel: '@ilustracaricaturas_/'
    }

};

const moveSlide = (direction) => {
    currentSlide.value = (currentSlide.value + direction + slides) % slides;
    nextTick(() => {
        if (slider) {
            slider.style.transform = `translateX(-${currentSlide.value * 100}%)`;
        }
    });
};

const showGallery = (galleryId) => {
    // Gallery data - in real app this would likely come from an API
    const galleries = {
        1: {
            title: 'Workshop de Pintura - 2024',
            images: [
                'https://images.unsplash.com/photo-1515169067868-5387ec356754',
                'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b',
                'https://images.unsplash.com/photo-1513364776144-60967b0f800f',
                'https://images.unsplash.com/photo-1515169067868-5387ec356754',
                'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b',
                'https://images.unsplash.com/photo-1513364776144-60967b0f800f',
                'https://images.unsplash.com/photo-1515169067868-5387ec356754',
                'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b',
                'https://images.unsplash.com/photo-1513364776144-60967b0f800f'
            ]
        },
        2: {
            title: 'Exposição Coletiva - 2024',
            images: [
                'https://images.unsplash.com/photo-1513364776144-60967b0f800f',
                'https://images.unsplash.com/photo-1515169067868-5387ec356754',
                'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b'
            ]
        },
        3: {
            title: 'III Sábado Cultural - 2025',
            images: [
                'https://images.unsplash.com/photo-1515169067868-5387ec356754',
                'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b',
                'https://images.unsplash.com/photo-1513364776144-60967b0f800f'          
            ]
        }
    };

    const gallery = galleries[galleryId];
    if (gallery) {
        galleryTitle.value = gallery.title;
        currentGallery.value = gallery.images;
        currentImageIndex.value = 0;
        showModal.value = true;
        galleryScrollPosition.value = 0; // Reset scroll position
        
        // Enable scrolling on modal content
        nextTick(() => {
            const modalContent = document.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.maxHeight = '80vh';
                modalContent.style.overflowY = 'auto';
                modalContent.scrollTop = 0;
            }
        });
    }
};

const showTeacherBio = (teacherId) => {
    const teacher = teachers[teacherId];
    if (teacher) {
        currentTeacher.value = teacher;
        showBioModal.value = true;
    }
};

const closeBioModal = () => {
    showBioModal.value = false;
    currentTeacher.value = null;
};

const closeGallery = () => {
    showModal.value = false;
    galleryScrollPosition.value = 0; // Reset scroll position on close
    currentImageIndex.value = 0;
};

const openFullImage = (imageUrl, index) => {
    currentImageIndex.value = index;
    showFullImage.value = true;
};

const nextImage = () => {
    currentImageIndex.value = (currentImageIndex.value + 1) % currentGallery.value.length;
};

const previousImage = () => {
    currentImageIndex.value = (currentImageIndex.value - 1 + currentGallery.value.length) % currentGallery.value.length;
};

const closeFullImage = () => {
    showFullImage.value = false;
};

// Track scroll position
const handleScroll = (event) => {
    galleryScrollPosition.value = event.target.scrollTop;
};

// Add this method after the other methods
const checkHeaderVisibility = () => {
    const heroSection = document.querySelector('header');
    if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        headerVisible.value = window.scrollY > heroBottom;
    }
};

// Add this method with the other methods
const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value;
};

// Add method to close workshop dialog
const closeWorkshopDialog = () => {
    showWorkshopDialog.value = false;
};

// Workshop navigation methods
const nextWorkshop = () => {
    currentWorkshopIndex.value = (currentWorkshopIndex.value + 1) % workshops.length;
};

const previousWorkshop = () => {
    currentWorkshopIndex.value = (currentWorkshopIndex.value - 1 + workshops.length) % workshops.length;
};

const goToWorkshop = (index) => {
    currentWorkshopIndex.value = index;
};

// Modify the onMounted hook
onMounted(() => {
    slider = document.getElementById('slider');
    slides = slider?.children.length || 0;
    
    // Start auto-play
    interval = setInterval(() => moveSlide(1), 5000);

    // Add scroll event listener
    window.addEventListener('scroll', checkHeaderVisibility);

    // Show workshop dialog on page load
    showWorkshopDialog.value = true;
    currentWorkshopIndex.value = 0;
});

// Modify the onUnmounted hook
onUnmounted(() => {
    // Clean up interval when component is destroyed
    if (interval) {
        clearInterval(interval);
    }
    // Remove scroll event listener
    window.removeEventListener('scroll', checkHeaderVisibility);
});
</script>


<template>
<div class="bg-stone-50">
    <!-- Workshop Dialog -->
    <div v-if="showWorkshopDialog" class="fixed inset-0 bg-black bg-opacity-75 z-[100] flex items-center justify-center" @click="closeWorkshopDialog">
        <div class="bg-white rounded-lg w-[90%] max-w-4xl h-[60vh] flex flex-col relative" @click.stop>
            <!-- Close Button -->
            <button @click="closeWorkshopDialog" class="absolute top-4 right-4 text-stone-600 hover:text-stone-800 z-10 bg-white rounded-full p-2 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            
            <!-- Navigation Buttons -->
            <button v-if="workshops.length > 1" @click.stop="previousWorkshop" class="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
            </button>
            <button v-if="workshops.length > 1" @click.stop="nextWorkshop" class="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
            </button>
            
            <div class="flex flex-col md:flex-row h-full overflow-hidden">
                <!-- Image Section -->
                <div class="w-full md:w-1/2 h-48 md:h-full relative overflow-hidden">
                    <transition name="fade" mode="out-in">
                        <img :key="currentWorkshopIndex" :src="workshops[currentWorkshopIndex].image" :alt="workshops[currentWorkshopIndex].title" class="w-full h-full object-cover">
                    </transition>
                </div>
                
                <!-- Content Section -->
                <div class="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
                    <transition name="fade" mode="out-in">
                        <div :key="currentWorkshopIndex">
                            <h2 class="font-lora text-3xl md:text-4xl text-stone-800 mb-4">{{ workshops[currentWorkshopIndex].title }}</h2>
                            <p class="font-lora text-lg text-stone-600 mb-4">
                                {{ workshops[currentWorkshopIndex].description }}
                            </p>
                            <p class="font-lora text-base text-stone-500 mb-4">
                                {{ workshops[currentWorkshopIndex].details }}
                            </p>
                            <p class="font-lora text-base text-stone-500 mb-6">
                                {{ workshops[currentWorkshopIndex].additionalInfo }}
                            </p>
                        </div>
                    </transition>
                    
                    <!-- WhatsApp and Instagram Buttons -->
                    <div class="mt-4 flex flex-nowrap gap-2">
                        <a :href="`https://wa.me/554130492413?text=${encodeURIComponent(workshops[currentWorkshopIndex].whatsappMessage)}`" target="_blank" class="bg-green-500/80 hover:bg-green-600/80 text-white px-3 py-2 rounded-lg flex items-center justify-center text-xs flex-1 min-w-0">
                            <svg class="w-4 h-4 mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                            <span class="truncate">WhatsApp</span>
                        </a>
                        <a :href="workshops[currentWorkshopIndex].instagramLink" target="_blank" class="bg-pink-600/80 hover:bg-pink-700/80 text-white px-3 py-2 rounded-lg flex items-center justify-center text-xs flex-1 min-w-0">
                            <svg class="w-4 h-4 mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                            <span class="truncate">Instagram</span>
                        </a>
                    </div>
                </div>
            </div>
            
            <!-- Workshop Indicators -->
            <div v-if="workshops.length > 1" class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                <button 
                    v-for="(workshop, index) in workshops" 
                    :key="index"
                    @click.stop="goToWorkshop(index)"
                    class="w-2 h-2 rounded-full transition-all"
                    :class="currentWorkshopIndex === index ? 'bg-stone-800 w-8' : 'bg-stone-400 hover:bg-stone-600'"
                ></button>
            </div>
        </div>
    </div>

    <!-- Fixed Header -->
    <nav class="fixed top-0 left-0 right-0 z-50 transition-transform duration-300" 
         :class="{ '-translate-y-full': !headerVisible }"
         :style="{ transform: headerVisible ? 'translateY(0)' : 'translateY(-100%)' }">
        <div class="bg-white/90 backdrop-blur-sm shadow-md">
            <div class="max-w-6xl mx-auto px-4 py-4">
                <div class="flex items-center justify-between">
                    <a href="#" class="font-lora text-2xl text-stone-800">Cotelier</a>
                    
                    <!-- Desktop Menu -->
                    <div class="hidden md:flex space-x-8">
                        <a href="#about" class="font-lora text-stone-600 hover:text-stone-900">Sobre</a>
                        <a href="#events" class="font-lora text-stone-600 hover:text-stone-900">Eventos</a>
                        <a href="#teachers" class="font-lora text-stone-600 hover:text-stone-900">Equipe</a>
                        <a href="#schedule" class="font-lora text-stone-600 hover:text-stone-900">Horários</a>
                        <a href="#trabalhe-conosco" class="font-lora text-stone-600 hover:text-stone-900">Colabore!</a>
                        <a href="#contact" class="font-lora text-stone-600 hover:text-stone-900">Contato</a>
                    </div>

                    <!-- Hamburger Button -->
                    <button class="md:hidden p-2" @click="toggleMobileMenu">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <!-- Mobile Menu -->
                <div v-if="mobileMenuOpen" class="md:hidden pt-4 pb-2">
                    <div class="flex flex-col space-y-3">
                        <a href="#about" @click="toggleMobileMenu" class="font-lora text-stone-600 hover:text-stone-900">Sobre</a>
                        <a href="#events" @click="toggleMobileMenu" class="font-lora text-stone-600 hover:text-stone-900">Eventos</a>
                        <a href="#teachers" @click="toggleMobileMenu" class="font-lora text-stone-600 hover:text-stone-900">Equipe</a>
                        <a href="#schedule" @click="toggleMobileMenu" class="font-lora text-stone-600 hover:text-stone-900">Horários</a>
                        <a href="#trabalhe-conosco" @click="toggleMobileMenu" class="font-lora text-stone-600 hover:text-stone-900">Colabore!</a>
                        <a href="#contact" @click="toggleMobileMenu" class="font-lora text-stone-600 hover:text-stone-900">Contato</a>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <header class="min-h-screen relative flex items-center justify-center">
        <div class="absolute inset-0 bg-[url('/src/assets/img/bg.jpg')] bg-cover bg-center opacity-50"></div>
        <div class="relative z-10 text-center px-4 bg-white/45 backdrop-blur-sm rounded-lg p-8">
            <h1 class="font-lora text-7xl md:text-9xl text-stone-900 mb-4 [text-shadow:_0_10_20px_rgb(255,255,255)]">Cotelier</h1>
            <p class="font-lora text-xl md:text-2xl text-stone-700 [text-shadow:_0_0_35px_rgb(255,255,255)]">Espaço Artístico Colaborativo </p>
        </div>
    </header>

    

    <!-- About Section -->
    <section id="about" class="bg-stone-100 py-20 px-4 md:px-8">
        <div class="max-w-4xl mx-auto">
            <h2 class="font-lora text-4xl md:text-5xl text-center mb-16 text-stone-800">Colaborativo e coletivo</h2>
            <div>
                <p class="font-lora text-xl md:text-1xl text-stone-600 leading-relaxed text-justify">
                    Aqui, no Cotelier, oferecemos um espaço acolhedor e inspirador para todos que desejam criar algo belo. Somos um verdadeiro santuário para a expressão artística, onde a criatividade flui livremente e obras de arte ganham vida. 
                </p>

                <p class="font-lora text-xl md:text-1xl text-stone-600 leading-relaxed text-justify mt-4">
                    Nosso ambiente é ideal tanto para artistas consagrados quanto para aqueles que estão começando, proporcionando um espaço para explorar sua paixão e expandir os limites de suas técnicas.
                </p>
                
                <p class="font-lora text-xl md:text-1xl text-stone-600 leading-relaxed text-justify mt-4">
                    Acreditamos no poder transformador da arte, capaz de conectar pessoas e mudar realidades. Por isso, cultivamos um ambiente que inspira e motiva cada artista a desenvolver seu potencial criativo ao máximo.
                </p>
                <p class="font-lora text-xl md:text-1xl text-stone-600 leading-relaxed text-justify mt-4">
                    Com mais de 10 anos de experiência, nosso atelier é um ponto de encontro colaborativo, onde artistas de todas as idades e níveis podem se conectar, aprender e crescer juntos.
                    Traga sua ideia, seu projeto, seu sonho, e vamos criar juntos!
                </p>
            </div>
        </div>
    </section>


    <!-- Events Section -->
    <section id="events" class="py-20 px-4 md:px-8 bg-stone-100">
        <h2 class="font-lora text-4xl md:text-5xl text-center mb-16 text-stone-800">Eventos recentes</h2>
        
        <div class="max-w-6xl mx-auto relative">
            <!-- Slider container -->
            <div class="overflow-hidden relative rounded-lg">
                <div class="flex transition-transform duration-500 ease-in-out" id="slider">
                    <!-- Slide 1 -->
                    <div class="min-w-full">
                        <div class="relative h-[500px] cursor-pointer" @click="showGallery(1)">
                            <img src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b" alt="Evento Workshop" class="w-full h-full object-cover">
                            <div class="absolute bottom-0 left-0 right-0 bg-black/50 p-8">
                                <h3 class="font-lora text-white text-3xl">Workshop de Pintura</h3>
                                <p class="font-lora text-white/90 text-xl mt-2">Explorando técnicas impressionistas</p>
                            </div>
                        </div>
                    </div>
                    <!-- Slide 2 -->
                    <div class="min-w-full">
                        <div class="relative h-[500px] cursor-pointer" @click="showGallery(2)">
                            <img src="https://images.unsplash.com/photo-1513364776144-60967b0f800f" alt="Exposição" class="w-full h-full object-cover">
                            <div class="absolute bottom-0 left-0 right-0 bg-black/50 p-8">
                                <h3 class="font-lora text-white text-3xl">Exposição Coletiva</h3>
                                <p class="font-lora text-white/90 text-xl mt-2">Alunos artistas apresentam suas obras</p>
                            </div>
                        </div>
                    </div>
                    <!-- Slide 3 -->
                    <div class="min-w-full">
                        <div class="relative h-[500px] cursor-pointer" @click="showGallery(3)">
                            <img src="https://images.unsplash.com/photo-1515169067868-5387ec356754" alt="Aula Aberta" class="w-full h-full object-cover">
                            <div class="absolute bottom-0 left-0 right-0 bg-black/50 p-8">
                                <h3 class="font-lora text-white text-3xl">III  Sábado Cultural</h3>
                                <p class="font-lora text-white/90 text-xl mt-2">Um dia muito especial para prestigiar nossos alunos</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Gallery Modal -->
                <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center" @click="closeGallery">
                    <div class="bg-white p-6 rounded-lg max-w-4xl w-full mx-4" @click.stop>
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="font-lora text-2xl text-stone-800">{{ galleryTitle }}</h3>
                            <button @click="closeGallery" class="text-stone-600 hover:text-stone-800">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 modal-content" @scroll="handleScroll">
                            <img v-for="(photo, index) in currentGallery" 
                                :key="index"
                                :src="photo"
                                :alt="'Photo ' + (index + 1)"
                                class="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                @click="openFullImage(photo, index)">
                        </div>
                    </div>
                </div>

                <!-- Full Image Modal -->
                <div v-if="showFullImage" 
                     class="fixed inset-0 bg-black z-[70] flex items-center justify-center"
                     @click="closeFullImage">
                    <div class="relative max-w-7xl w-full h-full flex items-center justify-center">
                        <!-- Previous button -->
                        <button @click.stop="previousImage" 
                                class="absolute left-4 p-2 text-white hover:bg-white/10 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        
                        <!-- Image -->
                        <img :src="currentGallery[currentImageIndex]" 
                             :alt="'Photo ' + (currentImageIndex + 1)"
                             class="max-h-[90vh] max-w-[90vw] object-contain"
                             @click.stop>
                        
                        <!-- Next button -->
                        <button @click.stop="nextImage" 
                                class="absolute right-4 p-2 text-white hover:bg-white/10 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                        
                        <!-- Close button -->
                        <button @click.stop="closeFullImage" 
                                class="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Navigation buttons -->
<button class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all" @click="moveSlide(-1)">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
</button>
<button class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all" @click="moveSlide(1)">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
</button>

            </div>
        </div>
    </section>

    <!-- Teachers Section -->
    <section id="teachers" class="py-20 px-4 md:px-8 bg-white">
        <div class="max-w-4xl mx-auto">
            <h2 class="font-lora text-4xl md:text-5xl text-center mb-16 text-stone-800">Conheça nossa equipe</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div v-for="(teacher, id) in teachers" :key="id" class="text-center">
                    <img :src="teacher.image" :alt="teacher.name" class="w-48 h-48 rounded-full mx-auto mb-6 object-cover hover:opacity-90 transition-opacity">
                    <h3 class="font-lora text-2xl text-stone-800 mb-3">{{ teacher.name }}</h3>
                    <p class="font-lora text-xl text-stone-600 mb-4">{{ teacher.role }}</p>
                    <p class="font-lora text-lg text-stone-500 mb-2">{{ teacher.bio }}</p>
                    <button @click="showTeacherBio(id)" class="text-blue-600 hover:text-blue-800 font-lora text-lg">Ler mais</button>
                </div>
            </div>
        </div>

        <!-- Teacher Bio Modal -->
        <div v-if="showBioModal" class="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center" @click="closeBioModal">
            <div class="bg-white p-8 rounded-lg max-w-2xl w-full mx-4" @click.stop>
                <div class="flex justify-between items-center mb-6">
                    <h3 class="font-lora text-3xl text-stone-800">{{ currentTeacher?.name }}</h3>
                    <button @click="closeBioModal" class="text-stone-600 hover:text-stone-800">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="flex flex-col md:flex-row gap-8">
                    <img :src="currentTeacher?.image" :alt="currentTeacher?.name" class="w-48 h-48 rounded-full object-cover mx-auto md:mx-0">
                    <div>
                        <p class="font-cormorant text-xl text-stone-600 mb-4">{{ currentTeacher?.role }}</p>
                        <p class="font-cormorant text-lg text-stone-500 mb-6">{{ currentTeacher?.fullBio }}</p>
                        <a :href="currentTeacher?.instagram" target="_blank" class="bg-pink-600/80 hover:bg-pink-700/80 text-white px-4 py-2 rounded-lg flex items-center justify-center text-sm w-fit">
                            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                            {{ currentTeacher?.instagramLabel }}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Class Schedule Section -->
    <section id="schedule" class="py-20 px-4 md:px-8 bg-stone-50">
        <div class="max-w-4xl mx-auto">
            <h2 class="font-lora text-4xl md:text-5xl text-center mb-16 text-stone-800">Horários de Aulas</h2>
            <div class="space-y-8">
                <div class="bg-white p-8 rounded-lg shadow-sm">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-lora text-2xl text-stone-800">Pintura a Óleo para iniciantes</h3>
                        <div class="flex items-center gap-1">
                            <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span class="text-blue-500 text-sm font-medium">Disponível</span>
                        </div>
                    </div>
                    <p class="font-lora text-xl text-stone-600 mb-4">Todas as Segundas e Quartas, 10:00 - 12:00</p>
                    <p class="font-lora text-lg text-stone-500 mb-4">Perfeito para quem está começando sua jornada artística. Aprenda técnicas fundamentais e teoria das cores.</p>
                    <div class="flex gap-4">
                        <a href="https://wa.me/554130492413?text=Olá! Gostaria de informações sobre o curso de Pintura a Óleo para iniciantes" target="_blank" class="bg-green-500/80 hover:bg-green-600/80 text-white px-4 py-2 rounded-lg flex items-center justify-center text-sm w-fit">
                            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                            Agende uma aula experimental
                        </a>
                    </div>
                </div>

                <div class="bg-white p-8 rounded-lg shadow-sm">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-lora text-2xl text-stone-800">Desenho para Jovens e Adultos</h3>
                        <div class="flex items-center gap-1">
                            <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span class="text-red-500 text-sm font-medium">Indisponível</span>
                        </div>
                    </div>
                    <p class="font-lora text-xl text-stone-600 mb-4">Todas as Quintas, 10:00 - 12:00</p>
                    <p class="font-lora text-lg text-stone-500 mb-4">Para todos entusiastas do desenho artístico, do básico ao avançado.</p>
                    <div class="flex gap-4">
                        <a href="https://wa.me/554130492413?text=Olá! Gostaria de entrar na lista de espera do curso de Desenho para Jovens e Adultos" target="_blank" class="bg-green-500/80 hover:bg-green-600/80 text-white px-4 py-2 rounded-lg flex items-center justify-center text-sm w-fit">
                            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                            Deixe seu nome na lista de espera
                        </a>
                    </div>
                </div>

                <div class="bg-white p-8 rounded-lg shadow-sm">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-lora text-2xl text-stone-800">Ateliê Multidisciplinar</h3>
                        <div class="flex items-center gap-1">
                            <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span class="text-blue-500 text-sm font-medium">Disponível</span>
                        </div>
                    </div>
                    <p class="font-lora text-xl text-stone-600 mb-4">Sábados, 09:00 - 12:00</p>
                    <p class="font-lora text-lg text-stone-500 mb-4">Explore livremente entre as técnicas de pintura a óleo ou acrílica, desenho artístico e ilustração digital</p>
                    <div class="flex gap-4">
                        <a href="https://wa.me/554130492413?text=Olá! Gostaria de informações sobre o Ateliê Multidisciplinar" target="_blank" class="bg-green-500/80 hover:bg-green-600/80 text-white px-4 py-2 rounded-lg flex items-center justify-center text-sm w-fit">
                            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                            Agende uma aula experimental
                        </a>
                    </div>
                </div>


<!-- Inserir novos cursos aqui -->



                
            </div>
        </div>
    </section>

    <!-- Work with Us Section -->
    <section id="trabalhe-conosco" class="py-20 px-4 md:px-8 bg-stone-50">
        <div class="max-w-4xl mx-auto">
            <h2 class="font-lora text-4xl md:text-5xl mb-8 text-stone-800 text-center">Colabore!</h2>
            <p class="font-lora text-xl md:text-2xl text-stone-600 mb-12 text-center">
                Venha trabalhar conosco! <br> Compartilhe seu talento e faça parte da nossa comunidade artística
            </p>

            <div class="bg-white p-8 rounded-lg shadow-sm">
                <div class="space-y-6">
                    <div>
                        <label for="nome" class="block font-lora text-lg text-stone-700 mb-2">Nome</label>
                        <input type="text" id="nome" class="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400">
                    </div>

                    <div>
                        <label for="portfolio" class="block font-lora text-lg text-stone-700 mb-2">Portfolio (link)</label>
                        <input type="url" id="portfolio" class="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400">
                    </div>

                    <div>
                        <label for="proposta" class="block font-lora text-lg text-stone-700 mb-2">Proposta</label>
                        <textarea id="proposta" rows="4" class="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"></textarea>
                    </div>

                    <div>
                        <label for="tipo" class="block font-lora text-lg text-stone-700 mb-2">Tipo de Atividade</label>
                        <select id="tipo" class="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400">
                            <option value="">Selecione uma opção</option>
                            <option value="oficina">Oficina</option>
                            <option value="workshop">Workshop</option>
                            <option value="palestra">Palestra</option>
                        </select>
                    </div>

                    <div class="flex justify-center mt-8">
                        <button onclick="
                            const nome = document.getElementById('nome').value;
                            const portfolio = document.getElementById('portfolio').value;
                            const proposta = document.getElementById('proposta').value;
                            const tipo = document.getElementById('tipo').value;
                            const msg = `Olá! Gostaria de propor uma colaboração:%0A%0ANome: ${nome}%0APortfolio: ${portfolio}%0ATipo: ${tipo}%0AProposta: ${proposta}`;
                            window.open(`https://wa.me/554130492413?text=${msg}`, '_blank');
                        " class="bg-green-500/80 hover:bg-green-600/80 text-white px-6 py-3 rounded-lg flex items-center justify-center text-lg">
                            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                            Enviar Proposta
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>



    <!-- Contact Section -->
    <section id="contact" class="py-20 px-4 md:px-8">
        <div class="max-w-4xl mx-auto text-center">
            <h2 class="font-lora text-4xl md:text-5xl mb-8 text-stone-800">Venha nos visitar</h2>
            <p class="font-lora text-xl md:text-2xl text-stone-600 mb-8">
                Rua Carlos Garibaldi Biazetto, 220<br>
                Boa Vista, Curitiba - PR<br>
            </p>
            

            <div class="flex flex-col sm:flex-row justify-center items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
                <a href="https://wa.me/554130492413" target="_blank" class="bg-green-500/80 hover:bg-green-600/80 text-white px-6 py-2 rounded-lg flex items-center justify-center text-sm w-36">
                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                </a>
                <a href="https://instagram.com/cotelier.oficial" target="_blank" class="bg-pink-600/80 hover:bg-pink-700/80 text-white px-6 py-2 rounded-lg flex items-center justify-center text-sm w-36">
                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    Instagram
                </a>
                <a href="https://facebook.com/cotelier.oficial" target="_blank" class="bg-blue-600/80 hover:bg-blue-700/80 text-white px-6 py-2 rounded-lg flex items-center justify-center text-sm w-36">
                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                </a>
                <a href="mailto:contato@cotelier.com" class="bg-orange-500/80 hover:bg-orange-600/80 text-white px-6 py-2 rounded-lg flex items-center justify-center text-sm w-36">
                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                    Email
                </a>
            </div>
            
            <!-- Google Maps iframe -->
            <div class="w-full h-96 mb-8 rounded-lg overflow-hidden shadow-lg">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3603.0374531294384!2d-49.25659492374376!3d-25.41145673799271!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94dce67da12fffff%3A0x89c7c7e11b8afd7e!2sR.%20Carlos%20Garibaldi%20Biazetto%2C%20220%20-%20Boa%20Vista%2C%20Curitiba%20-%20PR%2C%2082560-480!5e0!3m2!1spt-BR!2sbr!4v1704334040345!5m2!1spt-BR!2sbr"
                    width="100%"
                    height="100%"
                    style="border:0;"
                    allowfullscreen=""
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade">
                </iframe>
            </div>


        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-stone-900 text-stone-300 py-8">
        <div class="text-center font-cormorant">
            <p>&copy; 2025 Cotelier. Todos os direitos reservados.</p>
        </div>
    </footer>
  </div>
</template>

<style>
.font-playfair { font-family: 'Playfair Display', serif; }
.font-cormorant { font-family: 'Cormorant Garamond', serif; }
.font-lora { font-family: 'Lora', serif; }

html {
    scroll-behavior: smooth;
}

/* Workshop dialog transitions */
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
    opacity: 0;
}
</style>
