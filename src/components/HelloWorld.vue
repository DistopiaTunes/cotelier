
<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

const currentSlide = ref(0);
let slider = null;
let slides = 0;
let interval = null;

const moveSlide = (direction) => {
    currentSlide.value = (currentSlide.value + direction + slides) % slides;
    nextTick(() => {
        if (slider) {
            slider.style.transform = `translateX(-${currentSlide.value * 100}%)`;
        }
    });
};

onMounted(() => {
    slider = document.getElementById('slider');
    slides = slider?.children.length || 0;
    
    // Start auto-play
    interval = setInterval(() => moveSlide(1), 5000);
});

onUnmounted(() => {
    // Clean up interval when component is destroyed
    if (interval) {
        clearInterval(interval);
    }
});
</script>


<template>
<body class="bg-stone-50">
    <!-- Hero Section -->
    <header class="min-h-screen relative flex items-center justify-center">
        <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581337776066-5a0c60c9c797')] bg-cover bg-center opacity-30"></div>
        <div class="relative z-10 text-center px-4">
            <h1 class="font-playfair text-6xl md:text-8xl text-stone-900 mb-4">Cotelier</h1>
            <p class="font-cormorant text-xl md:text-2xl text-stone-700">Espaço Artístico Colaborativo </p>
        </div>
    </header>

    <!-- About Section -->
    <section class="bg-stone-100 py-20 px-4 md:px-8">
        <div class="max-w-4xl mx-auto text-center">
            <h2 class="font-playfair text-4xl md:text-5xl mb-8 text-stone-800">Nosso Atelier é de todos</h2>
            <p class="font-cormorant text-xl md:text-2xl text-stone-600 leading-relaxed">
                Cotelier é um santuário para a expressão artística, aqui a criatividade flui livremente e as obras de arte nascem. Nosso espaço oferece um ambiente ideal para artistas estabelecidos e emergentes explorar sua paixão e expandir os limites de sua técnica.
            </p>
            <p class="font-cormorant text-xl md:text-2xl text-stone-600 leading-relaxed">
                Com mais de 10 anos de experiência, nosso atelier é um espaço colaborativo onde artistas de todas as idades e níveis podem se conectar, aprender e crescer juntos. 
            </p>
            <p class="font-cormorant text-xl md:text-2xl text-stone-600 leading-relaxed">
                Traga sua ideia, seu projeto, seu desejo e vamos criar juntos!
            </p>
        </div>
    </section>
   
    <!-- Gallery Section -->
    <!-- <section class="py-20 px-4 md:px-8">
        <h2 class="font-playfair text-4xl md:text-5xl text-center mb-16 text-stone-800">Nossa Coleção</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <div class="group relative overflow-hidden">
                <img src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5" alt="Artwork" class="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-105">
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                    <h3 class="font-cormorant text-white text-2xl">Abstract Harmony</h3>
                </div>
            </div>
            <div class="group relative overflow-hidden">
                <img src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5" alt="Artwork" class="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-105">
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                    <h3 class="font-cormorant text-white text-2xl">Nature's Poetry</h3>
                </div>
            </div>
            <div class="group relative overflow-hidden">
                <img src="https://images.unsplash.com/photo-1579783901586-d88db74b4fe4" alt="Artwork" class="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-105">
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                    <h3 class="font-cormorant text-white text-2xl">Urban Dreams</h3>
                </div>
            </div>
        </div>
    </section> -->

    <!-- Events Section -->
    <section class="py-20 px-4 md:px-8 bg-stone-100">
        <h2 class="font-playfair text-4xl md:text-5xl text-center mb-16 text-stone-800">Eventos no Atelier</h2>
        
        <div class="max-w-6xl mx-auto relative">
            <!-- Slider container -->
            <div class="overflow-hidden relative">
                <div class="flex transition-transform duration-500 ease-in-out" id="slider">
                    <!-- Slide 1 -->
                    <div class="min-w-full">
                        <div class="relative h-[500px]">
                            <img src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b" alt="Evento Workshop" class="w-full h-full object-cover">
                            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-8">
                                <h3 class="font-cormorant text-white text-3xl">Workshop de Pintura</h3>
                                <p class="font-cormorant text-white/90 text-xl mt-2">Explorando técnicas impressionistas</p>
                            </div>
                        </div>
                    </div>
                    <!-- Slide 2 -->
                    <div class="min-w-full">
                        <div class="relative h-[500px]">
                            <img src="https://images.unsplash.com/photo-1513364776144-60967b0f800f" alt="Exposição" class="w-full h-full object-cover">
                            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-8">
                                <h3 class="font-cormorant text-white text-3xl">Exposição Coletiva</h3>
                                <p class="font-cormorant text-white/90 text-xl mt-2">Alunos artistas apresentam suas obras</p>
                            </div>
                        </div>
                    </div>
                    <!-- Slide 3 -->
                    <div class="min-w-full">
                        <div class="relative h-[500px]">
                            <img src="https://images.unsplash.com/photo-1515169067868-5387ec356754" alt="Aula Aberta" class="w-full h-full object-cover">
                            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-8">
                                <h3 class="font-cormorant text-white text-3xl">Sábado Cultural</h3>
                                <p class="font-cormorant text-white/90 text-xl mt-2">Venha conhecer nossa metodologia</p>
                            </div>
                        </div>
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
    <section class="py-20 px-4 md:px-8 bg-white">
        <div class="max-w-4xl mx-auto">
            <h2 class="font-playfair text-4xl md:text-5xl text-center mb-16 text-stone-800">Conheça nossos Professores</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div class="text-center">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330" alt="Sarah Mitchell" class="w-48 h-48 rounded-full mx-auto mb-6 object-cover">
                    <h3 class="font-playfair text-2xl text-stone-800 mb-3">Márcia Espíndola</h3>
                    <p class="font-cormorant text-xl text-stone-600 mb-4">Idealizadora do Cotelier e Professora de Pintura</p>
                    <p class="font-cormorant text-lg text-stone-500">Com mais de 20 anos de experiência, Márcia especializa-se em técnicas clássicas de pintura a óleo. Com abordagem acessível e inclusiva, Márcia busca inspirar e capacitar artistas de todos os níveis e idades.</p>
                </div>

                <div class="text-center">
                    <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e" alt="David Chen" class="w-48 h-48 rounded-full mx-auto mb-6 object-cover">
                    <h3 class="font-playfair text-2xl text-stone-800 mb-3">Raphael Francisco</h3>
                    <p class="font-cormorant text-xl text-stone-600 mb-4">Figure Drawing Master</p>
                    <p class="font-cormorant text-lg text-stone-500">Raphael é mestre em pintura pela UNESPAR, com mais de 10 anos de experiência na prática e ensino das artes visuais. Sua abordagem foca a exploração de diferentes técnicas e materiais, buscando sempre o equilíbrio entre as técnicas tradicionais e as práticas contemporâneas.</p>
                </div>

                <div class="text-center">
                    <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80" alt="Emma Walker" class="w-48 h-48 rounded-full mx-auto mb-6 object-cover">
                    <h3 class="font-playfair text-2xl text-stone-800 mb-3">Márcia Bellio</h3>
                    <p class="font-cormorant text-xl text-stone-600 mb-4">Watercolor Specialist</p>
                    <p class="font-cormorant text-lg text-stone-500">Emma's contemporary approach to watercolor has earned her recognition in modern art circles. She loves sharing her innovative techniques with students.</p>
                </div>

                <div class="text-center">
                    <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e" alt="Michael Torres" class="w-48 h-48 rounded-full mx-auto mb-6 object-cover">
                    <h3 class="font-playfair text-2xl text-stone-800 mb-3">Michael Torres</h3>
                    <p class="font-cormorant text-xl text-stone-600 mb-4">Mixed Media Artist</p>
                    <p class="font-cormorant text-lg text-stone-500">A versatile artist with a contemporary edge, Michael helps students explore various mediums and find their unique artistic voice.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Class Schedule Section -->
    <section class="py-20 px-4 md:px-8 bg-stone-50">
        <div class="max-w-4xl mx-auto">
            <h2 class="font-playfair text-4xl md:text-5xl text-center mb-16 text-stone-800">Horários de Aulas</h2>
            <div class="space-y-8">
                <div class="bg-white p-8 rounded-lg shadow-sm">
                    <h3 class="font-playfair text-2xl text-stone-800 mb-4">Pintura a Óleo para iniciantes</h3>
                    <p class="font-cormorant text-xl text-stone-600 mb-4">Every Monday & Wednesday, 10:00 AM - 12:00 PM</p>
                    <p class="font-cormorant text-lg text-stone-500">Perfect for those starting their artistic journey. Learn fundamental techniques and color theory.</p>
                </div>

                <div class="bg-white p-8 rounded-lg shadow-sm">
                    <h3 class="font-playfair text-2xl text-stone-800 mb-4">Advanced Figure Drawing</h3>
                    <p class="font-cormorant text-xl text-stone-600 mb-4">Tuesday & Thursday, 2:00 PM - 4:30 PM</p>
                    <p class="font-cormorant text-lg text-stone-500">For experienced artists looking to master human form and anatomy.</p>
                </div>

                <div class="bg-white p-8 rounded-lg shadow-sm">
                    <h3 class="font-playfair text-2xl text-stone-800 mb-4">Weekend Watercolor Workshop</h3>
                    <p class="font-cormorant text-xl text-stone-600 mb-4">Saturdays, 1:00 PM - 4:00 PM</p>
                    <p class="font-cormorant text-lg text-stone-500">Explore the fluidity and spontaneity of watercolor techniques.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section class="py-20 px-4 md:px-8">
        <div class="max-w-4xl mx-auto text-center">
            <h2 class="font-playfair text-4xl md:text-5xl mb-8 text-stone-800">Visit Us</h2>
            <p class="font-cormorant text-xl md:text-2xl text-stone-600 mb-8">
                123 Artisan Street<br>
                Creative District<br>
                contact@cotelier.com<br>
                +1 (555) 123-4567
            </p>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-stone-900 text-stone-300 py-8">
        <div class="text-center font-cormorant">
            <p>&copy; 2024 Cotelier. All rights reserved.</p>
        </div>
    </footer>
</body>
</template>

<style>
.font-playfair { font-family: 'Playfair Display', serif; }
.font-cormorant { font-family: 'Cormorant Garamond', serif; }
</style>
