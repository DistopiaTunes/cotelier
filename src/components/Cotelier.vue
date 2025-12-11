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
let workshopAutoScrollInterval = null;

// Swipe detection for mobile
let touchStartX = 0;
let touchEndX = 0;

// Workshops data
const workshops = [
    {
        title: 'Mãos que contam histórias (60+)',
        image: 'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/oficina/60%2B.jpeg',
        description: 'Quantas histórias suas mãos guardam?',
        details: 'Temos o prazer de convidar você para a nossa oficina especial de verão: "Mãos que contam histórias". ​Um espaço pensado exclusivamente para o público 60+, onde a criatividade não tem idade. Venha experimentar novas técnicas, fazer amigos, tomar um café gostoso e, acima de tudo, expressar quem você é através da arte',
        additionalInfo: 'Materiais inclusos. Não é necessário ter experiência prévia. Vagas Limitadas',
        whatsappMessage: 'Olá! Gostaria de informações sobre a "Oficina Mãos que conta histórias (60+)"',
        teacherIds: [3], // Mônica Lara
        duration: '48h',
        price: '2x R$380',
        dateTime: '8 Jan - 14h'
        // instagramLink: 'https://instagram.com/cotelier.oficial'
    },


    {
        title: 'Cerâmica - Pratinhos & Potinhos',
        image: 'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/cer/prato.jpg',
        description: 'Aprenda cerâmica de forma prática e divertida.',
        details: 'Oficina para iniciantes que querem viver a experiência da cerâmica. Iremos aprender a modelar as peças pela técnica de abertura de placas e pinch além de  explorar diversas possibilidades na criação e personalização. Faremos a festa usando carimbos e cortadores.',
        additionalInfo: 'Oportunidade imperdível! Materiais inclusos. Vagas limitadas!',
        whatsappMessage: 'Olá! Gostaria de informações sobre a Oficina Cerâmica - Pratinhos & Potinhos',
        teacherIds: [6],
        duration: '2,5h',
        price: 'R$250',
        dateTime: '16 Jan - 9h',
        instagramLink: 'https://instagram.com/cotelier.oficial'
    },

    {
        title: 'Cerâmica - Xícara e Bowl com Vinho (18+)',
        image: 'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/cer/xic.jpeg',
        description: 'Aprenda cerâmica de forma prática e divertida.',
        details: 'Oficina para adultos iniciantes que querem viver a experiência da cerâmica. Iremos aprender a modelar as peças pela técnica de abertura de placas e pinch além de  explorar diversas possibilidades na criação e personalização. Faremos a festa usando carimbos e cortadores.',
        additionalInfo: 'Oportunidade única! Materiais inclusos. Vagas limitadas!',
        whatsappMessage: 'Olá! Gostaria de informações sobre a Oficina Cerâmica - Xícara e Bowl com Vinho (18+)',
        teacherIds: [6],
        duration: '2,5h',
        price: 'R$270',
        dateTime: '16 Jan - 19h',
        instagramLink: 'https://instagram.com/cotelier.oficial'
    },


    {
        title: 'Pequenos Artistas Em Ação',
        image: 'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/wpq/wpq.jpeg',
        description: 'Aprenda as técnicas fundamentais da pintura em aquarela com nossa oficina especializada.',
        details: 'Durante 4 encontros, vamos explorar técnicas artísticas de forma leve, divertida e super criativa: Pintura com giz pastel oleoso, mosaico com aquarela, colagem usando papelão, artesanato com papel alumínio e canetinhas e mais!',
        additionalInfo: 'Um convite para experimentar, ousar, imaginar e transformar ideias em arte. Materiais inclusos. Vagas limitadas!',
        whatsappMessage: 'Olá! Gostaria de informações sobre a Oficina Pequenos Artistas Em Ação',
        teacherIds: [5],
        duration: '6h',
        price: 'R$280',
        dateTime: '6 Jan - 9h ou 14h',
        instagramLink: 'https://instagram.com/cotelier.oficial'
    },
    {
        title: 'Workshop de Caricaturas',
        image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b',
        description: 'Desenvolva suas habilidades de desenho realista com técnicas profissionais.',
        details: 'Aprenda a criar desenhos realistas impressionantes através de técnicas de sombreamento, proporção e detalhamento.',
        additionalInfo: 'Ideal para iniciantes e intermediários que desejam aprimorar suas técnicas.',
        whatsappMessage: 'Olá! Gostaria de informações sobre o Workshop de Caricaturas',
        teacherIds: [4],
        duration: '2h',
        price: 'R$100',
        dateTime: '15 Jan - 14h',
        instagramLink: 'https://instagram.com/cotelier.oficial'
    }
];

const teachers = {
    1: {
        name: 'Márcia Espíndola',
        role: 'Idealizadora do Cotelier, Artista e Professora',
        bio: 'Márcia Espíndola é artista plástica e educadora com mais de 30 anos de experiência, formada pela Faculdade de Artes do Paraná. Fundadora do Cotelier, se dedica ao ensino de Desenho Artístico e Pintura em Tela para todas as idades, promovendo um ambiente acolhedor, inclusivo e voltado ao desenvolvimento da expressão artística.',
        fullBio: 'Marcia  Espíndola é artista plástica e educadora em artes, formada pela Faculdade de Artes do Paraná, com ampla experiência no ensino de desenho artístico e pintura em tela. Atua há mais de 30 anos na formação artística de crianças, jovens e adultos, sendo fundadora e orientadora do Cotelier – Espaço Artístico Colaborativo.',
        image: 'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/profs/marcia2.jpeg',
        instagram: 'https://instagram.com/marciaespindolame',
        instagramLabel: '@marciaespindolame'
    },
    2: {
        name: 'Raphael Francisco', 
        role: 'Artista multidisciplinar',
        bio: 'Raphael explora constantemente novas linguagens nas artes visuais e dedica-se a compartilhar seu saber e experiência artística com a comunidade.',
        fullBio: 'Raphael é mestre em pintura pela UNESPAR, com mais de 10 anos de atuação na prática e ensino das artes visuais. Sua abordagem destaca a experimentação e o domínio de diferentes técnicas e materiais, buscando conciliar fundamentos clássicos com práticas artísticas atuais. Está sempre em busca de aprimoramento e inovação, trazendo uma visão ousada e investigativa para suas obras, especialmente quando trabalha com abstração, arte digital e pesquisas em linguagens visuais emergentes.',
        image: 'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/profs/raphael.jpg',
        instagram: 'https://instagram.com/raphael.ars',
        instagramLabel: '@raphael.ars'
    },
    3: {
        name: 'Mônica Lara',
        role: 'Artista plástica, Tatuadora e Professora',
        bio: 'Mônica Lara é uma artista plástica, tatuadora e professora de artes visuais. Sua abordagem é contemporânea e inovadora...',
        fullBio: 'Especializada em conduzir processos criativos com o público 60+.  Monica é focada em promover expressão, autonomia e bem-estar por meio da arte, sempre valorizando as histórias, vivências e identidades de cada pessoa. Desenvolve oficinas e aulas de pintura e desenho  que exploram pintura, colagem, técnicas manuais e experimentações sensoriais, criando ambientes acolhedores onde cada participante se sente confiante para descobrir novas formas de se expressar. "Acredito profundamente no poder da arte como ferramenta de conexão, autoestima e saúde emocional — especialmente na maturidade. Meu propósito é transformar cada encontro em uma experiência única, significativa e cheia de cores"',
        image: 'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/profs/monica.jpg',
        instagram: 'https://instagram.com/monicatatuadora',
        instagramLabel: '@monicatatuadora'
    },

    4: {
        name: 'Carlos Alexandre',
        role: 'Desenhista, Ilustrador eProfessor',
        bio: 'Carlos Alexandre tem sólida experiência em desenho, ilustração digital e tradicional, quadrinhos e mangás. Já ilustrou diversos livros e projetos editoriais. Domina técnicas variadas e incentiva criatividade e expressão em seus alunos.',
        fullBio: 'Carlos Alexandre atua há 10 anos nas artes visuais, com experiência em desenho, ilustração digital e tradicional, quadrinhos, além de adicionar ilustração de mangás e animes ao seu repertório artístico. Já ilustrou mais de dez livros infantis — vários publicados — além de revistas, capas, mascotes e projetos editoriais. Domina ferramentas como Photoshop e Illustrator, criando personagens, narrativas visuais e artes em diversos estilos. Também possui prática em retratos realistas, aquarela e lápis de cor. Como professor, dedica-se à formação de novos artistas, incentivando criatividade, técnica e expressão pessoal.',
        image: 'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/profs/alex.jpg',
        instagram: 'https://instagram.com/alexandrestudio182',
        instagramLabel: '@alexandrestudio182'
    },

    5: {
        name: 'Alessa Souza',
        role: 'Desenhista, Ilustradora, e professora',
        bio: 'Há 10 anos Alessa Souza cria ilustrações delicadas e cheias de poesia, trazendo leveza e sensibilidade para cada traço. Busca inspirar criatividade através de sua abordagem lúdica e descontraída.',
        fullBio: 'Alessa Souza é desenhista, ilustradora e professora, dedicada a cultivar a criatividade por meio de desenhos suaves e expressivos. Sua trajetória é marcada pela busca por inspiração em momentos simples e na natureza, transmitindo emoções e sonhos através de suas obras. Alessa conduz suas aulas de modo gentil, incentivando cada aluno a desenvolver sua própria voz artística, com olhar atento à harmonia e à sutileza das cores e formas. As ilustrações que cria são reconhecidas por despertar sensações de aconchego, imaginação e encantamento em quem as aprecia.',
        image: 'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/profs/alessa.jpeg',
        instagram: 'https://instagram.com/ilustracaricaturas_',
        instagramLabel: '@ilustracaricaturas_/'
    },
    6: {
        name: 'Luciana Kotaka',
        role: 'Ceramista e Psicóloga',
        bio: 'Luciana Kotaka é ceramista e psicóloga, unindo as duas áreas em um trabalho que visa produzir peças que revelam nossa essência. A cerâmica possibilita um trabalho interno intenso...',
        fullBio:'Luciana Kotaka é ceramista e psicóloga, unindo as duas áreas em um trabalho que visa produzir peças que revelam nossa essência. A cerâmica possibilita um trabalho interno intenso, pois o processo entre a criação e a finalização das peças nos leva a confrontar aspectos como o tempo, o perfeccionismo, o estado de presença e a frustração. Um trabalho artístico e emocional.',
        image: 'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/profs/luciana.jpeg',
        instagram: 'https://instagram.com/lu.ceramicando',
        instagramLabel: '@lu.ceramicando'
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
            title: 'Nossa Rotina',
            images: [
                'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/dia/e001.jpeg',
                'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/dia/e002.jpeg',
                'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/dia/e003.jpeg',
                'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/dia/e004.jpeg',
                'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/dia/e005.jpeg',
                'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/dia/e006.jpeg',
                'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/dia/e007.jpeg',
                'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/dia/e008.jpeg',
                'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/dia/e009.jpeg',
                'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/dia/e010.jpeg',
                'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/dia/e011.jpeg',
                'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/dia/e012.jpeg',
                'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/dia/e013.jpeg',
                'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/dia/e014.jpeg',
                'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/dia/e015.jpeg'
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
                'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/sab-cult/01.jpeg',
                'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/sab-cult/02.jpeg',
                'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/sab-cult/03.jpeg',
                'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/sab-cult/04.jpeg',
                'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/sab-cult/05.jpeg',
                'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/sab-cult/06.jpeg',
                'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/sab-cult/07.jpeg',
                'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/sab-cult/08.jpeg'
            ]
        },
        4: {
            title: 'Dia dos Avôs e Avós - Espaço Bis&Avós - 2025',
            images: [
                'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/bis/01.jpeg',
                'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/bis/02.jpeg',
                'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/bis/03.jpeg',
                'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/bis/04.jpeg',
                'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/bis/05.jpeg',
                'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/bis/06.jpeg',
                'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/bis/07.jpeg'
                // 'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/bis/08.jpeg'
            ]
        },
        5: {
            title: 'Seu traço completa o meu - Jockey Plaza - Parceria com Beer & Wine - 2025',
            images: [
                'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/nam/01.jpeg',
                'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/nam/02.jpeg',
                'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/nam/03.jpeg',
                'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/nam/04.jpeg',
                'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/nam/05.jpeg'
            ]
        },
        6: {
            title: 'Evento 6',
            images: [
                'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/ii/01.jpeg',
                'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/ii/02.jpeg',
                'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/ii/03.jpeg',
                'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/ii/04.jpeg',
                'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/ii/05.jpeg',
                'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/ii/06.jpeg',
                'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/ii/07.jpeg',
                'https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/ii/08.jpeg'
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
    // Clear autoscroll when dialog is closed
    if (workshopAutoScrollInterval) {
        clearInterval(workshopAutoScrollInterval);
        workshopAutoScrollInterval = null;
    }
};

// Start workshop autoscroll
const startWorkshopAutoScroll = () => {
    // Clear any existing interval
    if (workshopAutoScrollInterval) {
        clearInterval(workshopAutoScrollInterval);
    }
    // Start autoscroll every 5 seconds
    workshopAutoScrollInterval = setInterval(() => {
        if (showWorkshopDialog.value && workshops.length > 1) {
            nextWorkshop();
        }
    }, 10000);
};

// Pause autoscroll temporarily (will resume after 8 seconds)
const pauseWorkshopAutoScroll = () => {
    if (workshopAutoScrollInterval) {
        clearInterval(workshopAutoScrollInterval);
        workshopAutoScrollInterval = null;
    }
    // Resume after 8 seconds of inactivity
    setTimeout(() => {
        if (showWorkshopDialog.value) {
            startWorkshopAutoScroll();
        }
    }, 8000);
};

// Workshop navigation methods
const nextWorkshop = () => {
    currentWorkshopIndex.value = (currentWorkshopIndex.value + 1) % workshops.length;
    pauseWorkshopAutoScroll();
};

const previousWorkshop = () => {
    currentWorkshopIndex.value = (currentWorkshopIndex.value - 1 + workshops.length) % workshops.length;
    pauseWorkshopAutoScroll();
};

const goToWorkshop = (index) => {
    currentWorkshopIndex.value = index;
    pauseWorkshopAutoScroll();
};

// Swipe detection functions
const handleTouchStart = (e) => {
    touchStartX = e.changedTouches[0].screenX;
};

const handleTouchEnd = (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
};

const handleSwipe = () => {
    if (!touchStartX || !touchEndX) return;
    
    const swipeDistance = touchStartX - touchEndX;
    const minSwipeDistance = 50; // Minimum distance for a swipe
    
    if (Math.abs(swipeDistance) > minSwipeDistance) {
        if (swipeDistance > 0) {
            // Swipe left - next workshop
            nextWorkshop();
        } else {
            // Swipe right - previous workshop
            previousWorkshop();
        }
    }
    
    // Reset
    touchStartX = 0;
    touchEndX = 0;
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
    // Start autoscroll for workshops
    if (workshops.length > 1) {
        startWorkshopAutoScroll();
    }
});

// Modify the onUnmounted hook
onUnmounted(() => {
    // Clean up interval when component is destroyed
    if (interval) {
        clearInterval(interval);
    }
    // Clean up workshop autoscroll interval
    if (workshopAutoScrollInterval) {
        clearInterval(workshopAutoScrollInterval);
        workshopAutoScrollInterval = null;
    }
    // Remove scroll event listener
    window.removeEventListener('scroll', checkHeaderVisibility);
});
</script>


<template>
<div class="bg-stone-50">
    <!-- Workshop Dialog -->
    <div v-if="showWorkshopDialog" class="fixed inset-0 bg-black bg-opacity-75 z-[100] flex flex-col items-center justify-center" @click="closeWorkshopDialog">
        <h2 class="font-lora text-3xl md:text-4xl text-white mb-4 text-center">Oficinas de Férias</h2>
        <div class="bg-white rounded-lg w-[90%] max-w-4xl h-[60vh] flex flex-col relative mb-4" @click.stop @touchstart="handleTouchStart" @touchend="handleTouchEnd">
            <!-- Navigation Buttons (hidden on mobile) -->
            <button v-if="workshops.length > 1" @click.stop="previousWorkshop" class="hidden md:block absolute left-2 md:-left-16 top-1/2 -translate-y-1/2 z-10 bg-white/0 hover:bg-white/30 rounded-full p-2 shadow-md transition-all backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-white drop-shadow-md">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
            </button>
            <button v-if="workshops.length > 1" @click.stop="nextWorkshop" class="hidden md:block absolute right-2 md:-right-16 top-1/2 -translate-y-1/2 z-10 bg-white/0 hover:bg-white/30 rounded-full p-2 shadow-md transition-all backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-white drop-shadow-md">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
            </button>
            
            <div class="flex flex-col md:flex-row h-full overflow-hidden">
                <!-- Image Section -->
                <div class="w-full md:w-1/2 h-48 md:h-full relative overflow-hidden rounded-tl-lg rounded-tr-lg md:rounded-tl-lg md:rounded-bl-lg md:rounded-tr-none md:rounded-br-none">
                    <transition name="fade" mode="out-in">
                        <img :key="currentWorkshopIndex" :src="workshops[currentWorkshopIndex].image" :alt="workshops[currentWorkshopIndex].title" class="w-full h-full object-cover">
                    </transition>
                    <!-- Teacher Thumbnail in Image Corner -->
                    <div v-if="workshops[currentWorkshopIndex].teacherIds && workshops[currentWorkshopIndex].teacherIds.length > 0" class="absolute bottom-4 left-4 flex items-center gap-2">
                        <div v-for="teacherId in workshops[currentWorkshopIndex].teacherIds" :key="teacherId" class="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-1 py-1 shadow-lg">
                            <img 
                                :src="teachers[teacherId]?.image" 
                                :alt="teachers[teacherId]?.name"
                                class="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover flex-shrink-0"
                            />
                            <p class="text-stone-700 text-xs md:text-sm font-lora font-semibold pr-2">{{ teachers[teacherId]?.name }}</p>
                        </div>
                    </div>
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
                            <p class="font-lora text-base text-stone-500 mb-6 font-bold">
                                {{ workshops[currentWorkshopIndex].additionalInfo }}
                            </p>
                            
                            <!-- Duration, Price and DateTime Cards -->
                            <div class="flex flex-col md:flex-row items-center md:items-stretch md:justify-between gap-3 mb-6">
                                <!-- Duration Card -->
                                <div class="bg-stone-100 border border-stone-300 rounded-lg px-4 py-2 shadow-sm w-full md:w-auto">
                                    <span 
                                        contenteditable="true" 
                                        class="text-stone-800 text-base md:text-lg font-lora font-bold outline-none focus:bg-stone-50 focus:ring-2 focus:ring-stone-400 rounded px-1"
                                        @blur="workshops[currentWorkshopIndex].duration = $event.target.textContent"
                                    >{{ workshops[currentWorkshopIndex].duration || '3h' }}</span>
                                </div>
                                <!-- Price Card -->
                                <div class="bg-stone-100 border border-stone-300 rounded-lg px-4 py-2 shadow-sm w-full md:w-auto">
                                    <span 
                                        contenteditable="true" 
                                        class="text-stone-800 text-base md:text-lg font-lora font-bold outline-none focus:bg-stone-50 focus:ring-2 focus:ring-stone-400 rounded px-1"
                                        @blur="workshops[currentWorkshopIndex].price = $event.target.textContent"
                                    >{{ workshops[currentWorkshopIndex].price || 'R$ 100' }}</span>
                                </div>
                                <!-- DateTime Card -->
                                <div class="bg-stone-100 border border-stone-300 rounded-lg px-4 py-2 shadow-sm w-full md:w-auto">
                                    <span 
                                        contenteditable="true" 
                                        class="text-stone-800 text-base md:text-lg font-lora font-bold outline-none focus:bg-stone-50 focus:ring-2 focus:ring-stone-400 rounded px-1"
                                        @blur="workshops[currentWorkshopIndex].dateTime = $event.target.textContent"
                                    >{{ workshops[currentWorkshopIndex].dateTime || '15 Jan - 14h' }}</span>
                                </div>
                            </div>
                        </div>
                    </transition>
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
        <!-- WhatsApp Button (outside dialog) -->
        <div class="mb-4 flex justify-center items-center">
            <a :href="`https://wa.me/554130492413?text=${encodeURIComponent(workshops[currentWorkshopIndex].whatsappMessage)}`" target="_blank" class="bg-green-500/80 hover:bg-green-600/80 text-white px-14 py-5 rounded-full flex items-center justify-center text-base md:text-lg w-fit relative glow-btn">
                <svg class="w-6 h-6 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span class="truncate">Informações</span>
            </a>
        </div>
        <!-- Close Button -->
        <button @click="closeWorkshopDialog" class="mt-4 text-white hover:text-stone-200 bg-white/20 hover:bg-white/30 rounded-full p-3 shadow-lg transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
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
                    Aqui, no <b>Cotelier</b>, oferecemos um espaço acolhedor e inspirador para todos que desejam criar algo belo. Somos um verdadeiro santuário para a expressão artística, onde a criatividade flui livremente e obras de arte ganham vida. 
                </p>

                <p class="font-lora text-xl md:text-1xl text-stone-600 leading-relaxed text-justify mt-4">
                    Acreditamos no <b>poder transformador da arte</b>, capaz de conectar pessoas e mudar realidades. Por isso, cultivamos um ambiente que inspira e motiva cada artista a desenvolver seu potencial criativo ao máximo.
                </p>

                <p class="font-lora text-xl md:text-1xl text-stone-600 leading-relaxed text-justify mt-4">
                    Localizado no bairro <b>Boa Vista em Curitiba</b>, nosso ambiente é ideal tanto para artistas consagrados quanto para aqueles que estão começando sua jornada, proporcionando um espaço para explorar sua paixão e expandir os limites de suas técnicas.
                </p>
                

                <p class="font-lora text-xl md:text-1xl text-stone-600 leading-relaxed text-justify mt-4">
                    <b>Com mais de 20 anos de experiência</b>, nosso atelier é um ponto de encontro colaborativo, onde artistas de todas as idades e níveis podem se conectar, aprender e crescer coletivamente.
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
                            <img src="https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/dia/e006.jpeg" alt="Evento Workshop" class="w-full h-full object-cover">
                            <div class="absolute bottom-0 left-0 right-0 bg-black/50 p-8">
                                <h3 class="font-lora text-white text-3xl">Nossa Rotina Diária</h3>
                                <p class="font-lora text-white/90 text-xl mt-2">Um pouco do nosso trabalho diário no Cotelier</p>
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
                            <img src="https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/sab-cult/04.jpeg" alt="III - Sábado Cultural" class="w-full h-full object-cover">
                            <div class="absolute bottom-0 left-0 right-0 bg-black/50 p-8">
                                <h3 class="font-lora text-white text-3xl">III  Sábado Cultural - 2025</h3>
                                <p class="font-lora text-white/90 text-xl mt-2">Um dia muito especial para prestigiar nossos alunos</p>
                            </div>
                        </div>
                    </div>
                    <!-- Slide 4 -->
                     <div class="min-w-full">
                        <div class="relative h-[500px] cursor-pointer" @click="showGallery(4)">
                            <img src="https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/bis/02.jpeg" alt="III - Sábado Cultural" class="w-full h-full object-cover">
                            <div class="absolute bottom-0 left-0 right-0 bg-black/50 p-8">
                                <h3 class="font-lora text-white text-3xl">Dia dos Avôs e Avós - Espaço Bis&Avós - 2025</h3>
                                <p class="font-lora text-white/90 text-xl mt-2">Celebrando a melhor idade com arte!</p>
                            </div>
                        </div>
                    </div>
                    <!-- Slide 5 -->
                    <div class="min-w-full">
                        <div class="relative h-[500px] cursor-pointer" @click="showGallery(5)">
                            <img src="https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/nam/04.jpeg" alt="Seu traço completa o meu - Jockey Plaza - Parceria com Beer & Wine" class="w-full h-full object-cover">
                            <div class="absolute bottom-0 left-0 right-0 bg-black/50 p-8">
                                <h3 class="font-lora text-white text-3xl">Você completa meu traço - Dia dos namorados - 2025</h3>
                                <p class="font-lora text-white/90 text-xl mt-2"> Jockey Plaza - Parceria com Beer & Wine</p>
                            </div>
                        </div>
                    </div>
                    <!-- Slide 6 -->
                    <div class="min-w-full">
                        <div class="relative h-[500px] cursor-pointer" @click="showGallery(6)">
                            <img src="https://raw.githubusercontent.com/DistopiaTunes/cotelier/refs/heads/main/src/assets/img/eventos/ii/06.jpeg" alt="III - Sábado Cultural" class="w-full h-full object-cover">
                            <div class="absolute bottom-0 left-0 right-0 bg-black/50 p-8">
                                <h3 class="font-lora text-white text-3xl">II Sábado Cultural - 2024</h3>
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

                <p class="text-2xl text-stone-700 text-center mb-10 font-lora">Segunda-feira</p>
                
                
                <div class="bg-white p-8 rounded-lg shadow-sm relative">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-lora text-2xl text-stone-800">Oficina Livre de Desenho Artístico e Pintura em Tela</h3>
                        <div class="flex items-center gap-1">
                            <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span class="text-blue-500 text-sm font-medium">Disponível</span>
                        </div>
                    </div>
                    <p class="font-lora text-xl text-stone-600 mb-4">Segundas-feiras das <b><u>14:00 às 15:30h</u></b>, <b><u>16:00 às 17:30h</u></b>  e <b><u>18:30 às 20h</u></b>- Faixa etária: de 5 a 10 anos</p>
                    <p class="font-lora text-lg text-stone-500 mb-4">Perfeito para quem está começando sua jornada artística. Aprenda técnicas fundamentais de desenho e pintura, luz e sombra, proporção, teoria das cores e mais.</p>
                    <div class="flex flex-col md:flex-row gap-4 items-center">
                        <a href="https://wa.me/554130492413?text=Olá! Gostaria de informações sobre o curso de Pintura a Óleo para iniciantes" target="_blank" class="bg-green-500/80 hover:bg-green-600/80 text-white px-4 py-2 rounded-lg flex items-center justify-center text-sm w-fit">
                            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                            Agende uma aula experimental
                        </a>
                        <!-- Teacher Badge - Mobile: below button, Desktop: absolute bottom-right -->
                        <div class="flex md:absolute md:bottom-8 md:right-8 items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2">
                            <img 
                                :src="teachers[5]?.image" 
                                :alt="teachers[5]?.name"
                                class="w-5 h-5 rounded-full object-cover flex-shrink-0"
                            />
                            <p class="text-stone-700 text-sm font-lora font-semibold">{{ teachers[5]?.name }}</p>
                        </div>
                    </div>
                </div>


                <p class="text-2xl text-stone-700 text-center mb-10 font-lora">Terça-feira</p>
                
                
                <div class="bg-white p-8 rounded-lg shadow-sm relative">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-lora text-2xl text-stone-800">Oficina Livre de Desenho Artístico e Pintura em Tela</h3>
                        <div class="flex items-center gap-1">
                            <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span class="text-blue-500 text-sm font-medium">Disponível</span>
                        </div>
                    </div>
                    <p class="font-lora text-xl text-stone-600 mb-4">Terças-feiras das <b><u>14h às 15:30h</u></b> - Faixa etária: acima de 12 anos</p>
                    <p class="font-lora text-lg text-stone-500 mb-4">Perfeito para quem está começando sua jornada artística. Aprenda técnicas fundamentais de desenho e pintura, luz e sombra, proporção, teoria das cores e mais.</p>
                    <div class="flex flex-col md:flex-row gap-4 items-center">
                        <a href="https://wa.me/554130492413?text=Olá! Gostaria de informações sobre o curso de Pintura a Óleo para iniciantes" target="_blank" class="bg-green-500/80 hover:bg-green-600/80 text-white px-4 py-2 rounded-lg flex items-center justify-center text-sm w-fit">
                            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                            Agende uma aula experimental
                        </a>
                        <!-- Teacher Badge - Mobile: below button, Desktop: absolute bottom-right -->
                        <div class="flex md:absolute md:bottom-8 md:right-8 items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2">
                            <img 
                                :src="teachers[1]?.image" 
                                :alt="teachers[1]?.name"
                                class="w-5 h-5 rounded-full object-cover flex-shrink-0"
                            />
                            <p class="text-stone-700 text-sm font-lora font-semibold">{{ teachers[1]?.name }}</p>
                        </div>
                    </div>
                </div>


                <div class="bg-white p-8 rounded-lg shadow-sm relative">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-lora text-2xl text-stone-800">Oficina Livre de Desenho Artístico e Pintura em Tela</h3>
                        <div class="flex items-center gap-1">
                            <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span class="text-blue-500 text-sm font-medium">Disponível</span>
                        </div>
                    </div>
                    <p class="font-lora text-xl text-stone-600 mb-4">Terças-feiras das <b><u>16h às 17:30h</u></b>- Faixa etária: a partir de 8 a 11 anos</p>
                    <p class="font-lora text-lg text-stone-500 mb-4">Perfeito para quem está começando sua jornada artística. Aprenda técnicas fundamentais de desenho e pintura, luz e sombra, proporção, teoria das cores e mais.</p>
                    <div class="flex flex-col md:flex-row gap-4 items-center">
                        <a href="https://wa.me/554130492413?text=Olá! Gostaria de informações sobre o curso de Pintura a Óleo para iniciantes" target="_blank" class="bg-green-500/80 hover:bg-green-600/80 text-white px-4 py-2 rounded-lg flex items-center justify-center text-sm w-fit">
                            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                            Agende uma aula experimental
                        </a>
                        <!-- Teacher Badge - Mobile: below button, Desktop: absolute bottom-right -->
                        <div class="flex md:absolute md:bottom-8 md:right-8 items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2">
                            <img 
                                :src="teachers[1]?.image" 
                                :alt="teachers[1]?.name"
                                class="w-5 h-5 rounded-full object-cover flex-shrink-0"
                            />
                            <p class="text-stone-700 text-sm font-lora font-semibold">{{ teachers[1]?.name }}</p>
                        </div>
                    </div>
                </div>

                <p class="text-2xl text-stone-700 text-center mb-10 font-lora">Quarta-feira</p>

                <div class="bg-white p-8 rounded-lg shadow-sm relative">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-lora text-2xl text-stone-800">Oficina Livre de Desenho Artístico e Pintura em Tela</h3>
                        <div class="flex items-center gap-1">
                            <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span class="text-blue-500 text-sm font-medium">Disponível</span>
                        </div>
                    </div>
                    <p class="font-lora text-xl text-stone-600 mb-4">Quartas-feiras das <b><u>8h às 09:30h</u></b>  - Faixa Etária: A partir de 12 anos</p>
                    <p class="font-lora text-lg text-stone-500 mb-4">Perfeito para quem está começando sua jornada artística. Aprenda técnicas fundamentais de desenho e pintura, luz e sombra, proporção, teoria das cores e mais.</p>
                    <div class="flex flex-col md:flex-row gap-4 items-center">
                        <a href="https://wa.me/554130492413?text=Olá! Gostaria de informações sobre o curso de Pintura a Óleo para iniciantes" target="_blank" class="bg-green-500/80 hover:bg-green-600/80 text-white px-4 py-2 rounded-lg flex items-center justify-center text-sm w-fit">
                            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                            Agende uma aula experimental
                        </a>
                        <!-- Teacher Badge - Mobile: below button, Desktop: absolute bottom-right -->
                        <div class="flex md:absolute md:bottom-8 md:right-8 items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2">
                            <img 
                                :src="teachers[1]?.image" 
                                :alt="teachers[1]?.name"
                                class="w-5 h-5 rounded-full object-cover flex-shrink-0"
                            />
                            <p class="text-stone-700 text-sm font-lora font-semibold">{{ teachers[1]?.name }}</p>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-8 rounded-lg shadow-sm relative">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-lora text-2xl text-stone-800">Oficina Kids</h3>
                        <div class="flex items-center gap-1">
                            <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span class="text-blue-500 text-sm font-medium">Disponível</span>
                        </div>
                    </div>
                    <p class="font-lora text-xl text-stone-600 mb-4">Quartas-feiras das <b><u>9:30 às 11h</u></b> - Faixa Etária: De 7 a 11 anos</p>
                    <p class="font-lora text-lg text-stone-500 mb-4">Perfeito para quem está começando sua jornada artística. Aprenda técnicas fundamentais de desenho e pintura, luz e sombra, proporção, teoria das cores e mais.</p>
                    <div class="flex flex-col md:flex-row gap-4 items-center">
                        <a href="https://wa.me/554130492413?text=Olá! Gostaria de informações sobre o curso de Pintura a Óleo para iniciantes" target="_blank" class="bg-green-500/80 hover:bg-green-600/80 text-white px-4 py-2 rounded-lg flex items-center justify-center text-sm w-fit">
                            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                            Agende uma aula experimental
                        </a>
                        <!-- Teacher Badge - Mobile: below button, Desktop: absolute bottom-right -->
                        <div class="flex md:absolute md:bottom-8 md:right-8 items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2">
                            <img 
                                :src="teachers[1]?.image" 
                                :alt="teachers[1]?.name"
                                class="w-5 h-5 rounded-full object-cover flex-shrink-0"
                            />
                            <p class="text-stone-700 text-sm font-lora font-semibold">{{ teachers[1]?.name }}</p>
                        </div>
                    </div>
                </div>



                <div class="bg-white p-8 rounded-lg shadow-sm relative">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-lora text-2xl text-stone-800">Oficina Livre de Desenho Artístico e Pintura em Tela</h3>
                        <div class="flex items-center gap-1">
                            <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span class="text-blue-500 text-sm font-medium">Disponível</span>
                        </div>
                    </div>
                    <p class="font-lora text-xl text-stone-600 mb-4">Quartas-feiras das <b><u>14h às 15:30h</u></b>- Faixa etária: a partir de 8 a 11 anos</p>
                    <p class="font-lora text-lg text-stone-500 mb-4">Perfeito para quem está começando sua jornada artística. Aprenda técnicas fundamentais de desenho e pintura, luz e sombra, proporção, teoria das cores e mais.</p>
                    <div class="flex flex-col md:flex-row gap-4 items-center">
                        <a href="https://wa.me/554130492413?text=Olá! Gostaria de informações sobre o curso de Pintura a Óleo para iniciantes" target="_blank" class="bg-green-500/80 hover:bg-green-600/80 text-white px-4 py-2 rounded-lg flex items-center justify-center text-sm w-fit">
                            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                            Agende uma aula experimental
                        </a>
                        <!-- Teacher Badge - Mobile: below button, Desktop: absolute bottom-right -->
                        <div class="flex md:absolute md:bottom-8 md:right-8 items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2">
                            <img 
                                :src="teachers[1]?.image" 
                                :alt="teachers[1]?.name"
                                class="w-5 h-5 rounded-full object-cover flex-shrink-0"
                            />
                            <p class="text-stone-700 text-sm font-lora font-semibold">{{ teachers[1]?.name }}</p>
                        </div>
                    </div>
                </div>



                <div class="bg-white p-8 rounded-lg shadow-sm relative">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-lora text-2xl text-stone-800">Oficina Livre de Desenho Artístico e Pintura em Tela</h3>
                        <div class="flex items-center gap-1">
                            <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span class="text-blue-500 text-sm font-medium">Disponível</span>
                        </div>
                    </div>
                    <p class="font-lora text-xl text-stone-600 mb-4">Quartas-feiras das <b><u>16h às 17:30h</u></b>  - Faixa Etária: A partir de 12 anos</p>
                    <p class="font-lora text-lg text-stone-500 mb-4">Perfeito para quem está começando sua jornada artística. Aprenda técnicas fundamentais de desenho e pintura, luz e sombra, proporção, teoria das cores e mais.</p>
                    <div class="flex flex-col md:flex-row gap-4 items-center">
                        <a href="https://wa.me/554130492413?text=Olá! Gostaria de informações sobre o curso de Pintura a Óleo para iniciantes" target="_blank" class="bg-green-500/80 hover:bg-green-600/80 text-white px-4 py-2 rounded-lg flex items-center justify-center text-sm w-fit">
                            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                            Agende uma aula experimental
                        </a>
                        <!-- Teacher Badge - Mobile: below button, Desktop: absolute bottom-right -->
                        <div class="flex md:absolute md:bottom-8 md:right-8 items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2">
                            <img 
                                :src="teachers[1]?.image" 
                                :alt="teachers[1]?.name"
                                class="w-5 h-5 rounded-full object-cover flex-shrink-0"
                            />
                            <p class="text-stone-700 text-sm font-lora font-semibold">{{ teachers[1]?.name }}</p>
                        </div>
                    </div>
                </div>




                <p class="text-2xl text-stone-700 text-center mb-10 font-lora">Quinta-feira</p>





                <div class="bg-white p-8 rounded-lg shadow-sm relative">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-lora text-2xl text-stone-800">Desenho para Jovens e Adultos</h3>
                        <div class="flex items-center gap-1">
                            <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span class="text-red-500 text-sm font-medium">Indisponível</span>
                        </div>
                    </div>
                    <p class="font-lora text-xl text-stone-600 mb-4">Quintas-feiras das <b><u>10:00 às 12:00</u></b></p>
                    <p class="font-lora text-lg text-stone-500 mb-4">Para todos entusiastas do desenho artístico, do básico ao avançado.</p>
                    <div class="flex flex-col md:flex-row gap-4 items-center">
                        <a href="https://wa.me/554130492413?text=Olá! Gostaria de entrar na lista de espera do curso de Desenho para Jovens e Adultos" target="_blank" class="bg-green-500/80 hover:bg-green-600/80 text-white px-4 py-2 rounded-lg flex items-center justify-center text-sm w-fit">
                            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                            Deixe seu nome na lista de espera
                        </a>
                        <!-- Teacher Badge - Mobile: below button, Desktop: absolute bottom-right -->
                        <div class="flex md:absolute md:bottom-8 md:right-8 items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2">
                            <img 
                                :src="teachers[1]?.image" 
                                :alt="teachers[1]?.name"
                                class="w-5 h-5 rounded-full object-cover flex-shrink-0"
                            />
                            <p class="text-stone-700 text-sm font-lora font-semibold">{{ teachers[1]?.name }}</p>
                        </div>
                    </div>
                </div>

                <p class="text-2xl text-stone-700 text-center mb-10 font-lora">Sábado</p>

                <div class="bg-white p-8 rounded-lg shadow-sm relative">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-lora text-2xl text-stone-800">Ateliê Multidisciplinar</h3>
                        <div class="flex items-center gap-1">
                            <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span class="text-blue-500 text-sm font-medium">Disponível</span>
                        </div>
                    </div>
                    <p class="font-lora text-xl text-stone-600 mb-4">Sábados das <b><u>09:00 às 10:30</u></b> e <b><u>10:30 às 12:00</u></b> - Faixa etária: <a href="http://"></a> partir de 12 anos</p>
                    <p class="font-lora text-lg text-stone-500 mb-4">Ideal para quem busca desenvolver sua própria linguagem artística. Explore livremente entre as técnicas de pintura a óleo ou acrílica, desenho artístico, gravura e ilustração digital</p>
                    <div class="flex flex-col md:flex-row gap-4 items-center">
                        <a href="https://wa.me/554130492413?text=Olá! Gostaria de informações sobre o Ateliê Multidisciplinar" target="_blank" class="bg-green-500/80 hover:bg-green-600/80 text-white px-4 py-2 rounded-lg flex items-center justify-center text-sm w-fit">
                            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                            Agende uma aula experimental
                        </a>
                        <!-- Teacher Badge - Mobile: below button, Desktop: absolute bottom-right -->
                        <div class="flex md:absolute md:bottom-8 md:right-8 items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2">
                            <img 
                                :src="teachers[2]?.image" 
                                :alt="teachers[2]?.name"
                                class="w-5 h-5 rounded-full object-cover flex-shrink-0"
                            />
                            <p class="text-stone-700 text-sm font-lora font-semibold">{{ teachers[2]?.name }}</p>
                        </div>
                    </div>
                </div>






                <div class="bg-white p-8 rounded-lg shadow-sm relative">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-lora text-2xl text-stone-800">Anime e Mangá</h3>
                        <div class="flex items-center gap-1">
                            <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span class="text-blue-500 text-sm font-medium">Disponível</span>
                        </div>
                    </div>
                    <p class="font-lora text-xl text-stone-600 mb-4">Sábados das <b><u>14:00 às 15:00</u></b> - Faixa etária: a partir de 7 anos</p>
                    <p class="font-lora text-lg text-stone-500 mb-4">Perfeito para quem quer aprender a criar personagens no estilo mangá e anime.
                        Técnicas de desenho anatômico, expressões faciais, poses, narrativa visual e construção de estilo indivdual.</p>
                    <div class="flex flex-col md:flex-row gap-4 items-center">
                        <a href="https://wa.me/554130492413?text=Olá! Gostaria de informações sobre o Curso de Anime e Mangá" target="_blank" class="bg-green-500/80 hover:bg-green-600/80 text-white px-4 py-2 rounded-lg flex items-center justify-center text-sm w-fit">
                            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                            Agende uma aula experimental
                        </a>
                        <!-- Teacher Badge - Mobile: below button, Desktop: absolute bottom-right -->
                        <div class="flex md:absolute md:bottom-8 md:right-8 items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2">
                            <img 
                                :src="teachers[4]?.image" 
                                :alt="teachers[4]?.name"
                                class="w-5 h-5 rounded-full object-cover flex-shrink-0"
                            />
                            <p class="text-stone-700 text-sm font-lora font-semibold">{{ teachers[4]?.name }}</p>
                        </div>
                    </div>
                </div>


                <div class="bg-white p-8 rounded-lg shadow-sm relative">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-lora text-2xl text-stone-800">Ilustração (Digital, Tradicional e Aquarela)</h3>
                        <div class="flex items-center gap-1">
                            <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span class="text-blue-500 text-sm font-medium">Disponível</span>
                        </div>
                    </div>
                    <p class="font-lora text-xl text-stone-600 mb-4">Sábados das <b><u>15:00 às 16:00</u></b> - Faixa etária: a partir de 7 anos</p>
                    <p class="font-lora text-lg text-stone-500 mb-4">Curso ideal para quem deseja desenvolver ilustração artística em diferentes técnicas.
                        Inclui ilustração digital, tradicional, aquarela, quadrinhos, caricatura e ilustração infantil.</p>
                    <div class="flex gap-4">
                        <a href="https://wa.me/554130492413?text=Olá! Gostaria de informações sobre o Curso de Ilustração (Digital, Tradicional e Aquarela)" target="_blank" class="bg-green-500/80 hover:bg-green-600/80 text-white px-4 py-2 rounded-lg flex items-center justify-center text-sm w-fit">
                            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                            Agende uma aula experimental
                        </a>
                    </div>
                    <!-- Teacher Badge -->
                    <div class="absolute bottom-8 right-8 flex items-center gap-2 bg-white-600/80 rounded-lg px-4 py-2">
                        <img 
                            :src="teachers[4]?.image" 
                            :alt="teachers[4]?.name"
                            class="w-5 h-5 rounded-full object-cover flex-shrink-0"
                        />
                        <p class="text-stone text-sm font-lora font-semibold">{{ teachers[4]?.name }}</p>
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
            <p class="text-sm">O portal do Cotelier não utiliza, armazena ou compartilha cookies e dados cadastrais dos seus clientes.</p>
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

/* WhatsApp button glow effect */
.glow-btn {
    box-shadow: 0 0 6px 1px rgba(34, 197, 94, 0.3), 0 0 12px 3px rgba(22, 163, 74, 0.2);
    animation: glowPulse 2.5s infinite alternate;
    transition: box-shadow 0.3s;
}

@keyframes glowPulse {
    0% {
        box-shadow: 0 0 6px 1px rgba(34, 197, 94, 0.3), 0 0 12px 3px rgba(22, 163, 74, 0.2);
    }
    100% {
        box-shadow: 0 0 10px 3px rgba(34, 197, 94, 0.4), 0 0 18px 6px rgba(22, 163, 74, 0.3);
    }
}

.glow-btn:hover {
    animation: none;
    box-shadow: 0 0 12px 4px rgba(34, 197, 94, 0.5), 0 0 20px 8px rgba(22, 163, 74, 0.4);
}

/* Floating arrow indicator */
.arrow-indicator {
    display: flex;
    justify-content: center;
    filter: drop-shadow(0 0 4px rgba(239, 171, 68, 0.5));
    animation: arrowBounceLeft 1.5s infinite alternate;
}

.arrow-indicator-right {
    display: flex;
    justify-content: center;
    filter: drop-shadow(0 0 4px rgba(239, 171, 68, 0.5));
    animation: arrowBounceRight 1.5s infinite alternate;
}

@keyframes arrowBounceLeft {
    0% { 
        transform: translateX(calc(-50% - 8rem - 10px)) translateY(-50%);
    }
    100% { 
        transform: translateX(calc(-50% - 8rem - 2px)) translateY(-50%);
    }
}

@keyframes arrowBounceRight {
    0% { 
        transform: translateX(calc(50% + 8rem + 10px)) translateY(-50%);
    }
    100% { 
        transform: translateX(calc(50% + 8rem + 2px)) translateY(-50%);
    }
}
</style>
