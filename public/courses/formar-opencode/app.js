import { courseData } from './data.mjs'; // Importação corrigida para ES Module

class TrainingApp {
    constructor() {
        this.data = courseData;
        this.currentModuleIndex = 0;
        this.slideIndex = 0;
        this.hotspotVisited = new Map();
        this.dynamicsHotspotVisited = new Map();

        this.appContainer = document.getElementById('app');
        this.mainAppContainer = document.getElementById('mainAppContainer');
        this.appContentWrapper = document.getElementById('appContentWrapper');
        this.notificationArea = document.getElementById('notificationArea');

        this.quizSession = null;
        this.init();
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    async init() {
        if (typeof removeLoadingOverlay === 'function') {
            removeLoadingOverlay();
        }

        // Parse module from URL if present
        const urlParams = new URLSearchParams(window.location.search);
        const moduleParam = urlParams.get('module');
        if (moduleParam !== null) {
            const modIndex = parseInt(moduleParam) - 1;
            if (modIndex >= 0 && modIndex < this.data.modules.length) {
                this.currentModuleIndex = modIndex;
            }
        }

        this.showMainApp();
        this.loadModule(this.currentModuleIndex, this.slideIndex);
        this.setupEventListeners();
    }

    showMainApp() {
        this.mainAppContainer.classList.remove('hidden');
        this.appContainer.classList.add('logged-in');
        this.renderDashboard();
    }

    renderDashboard() {
        const dashboardContentHtml = `
            <main class="content-area">
                <header class="content-header">
                    <h1 id="moduleTitle">Carregando...</h1>
                </header>
                <div id="moduleContentArea" class="module-view"></div>
            </main>
        `;

        this.appContentWrapper.innerHTML = dashboardContentHtml;

        this.moduleTitle = document.getElementById('moduleTitle');
        this.contentArea = document.getElementById('moduleContentArea');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');

        if (this.prevBtn) {
            this.prevBtn.onclick = () => this.navigate(-1);
        }
        if (this.nextBtn) {
            this.nextBtn.onclick = () => this.navigate(1);
        }
    }


    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        this.notificationArea.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('fade-out');
            notification.addEventListener('transitionend', () => notification.remove());
        }, 3000);
    }
    setupEventListeners() {
        // Keyboard Navigation
        document.addEventListener('keydown', (e) => {
            // Only allow keyboard navigation if main app is visible (logged in) and data is loaded
            if (this.mainAppContainer.classList.contains('hidden') || !this.data) return;

            // Do not navigate if user is typing in an input field
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            const module = this.data.modules[this.currentModuleIndex];

            if (e.key === 'ArrowRight' || e.key === 'Enter') {
                this.handleSearchNext(module);
            } else if (e.key === 'ArrowLeft') {
                this.handleSearchPrev(module);
            }
        });
    }

    handleSearchNext(module) {
        // 1. If in Slides
        const nextSlideBtn = document.getElementById('nextSlide');
        const startVideoBtn = document.getElementById('startVideo');
        const startDynamicsViewBtn = document.getElementById('startDynamicsView');
        const nextQuestionBtn = document.getElementById('nextQuestionBtn');
        const startQuizBtn = document.getElementById('startQuiz');
        const finishModuleBtn = document.getElementById('finishModule');

        if (nextSlideBtn) nextSlideBtn.click();
        else if (startVideoBtn) startVideoBtn.click();
        else if (startDynamicsViewBtn) startDynamicsViewBtn.click();
        else if (nextQuestionBtn) nextQuestionBtn.click();
        else if (startQuizBtn) startQuizBtn.click();
        else if (finishModuleBtn) finishModuleBtn.click();
        else {
            // Se o botão não existir ou estiver habilitado, permitimos a navegação via teclado
            if (!this.nextBtn || !this.nextBtn.disabled) {
                this.navigate(1);
            }
        }
    }

    handleSearchPrev(module) {
        const prevSlideBtn = document.getElementById('prevSlide');
        const backToSlidesBtn = document.getElementById('backToSlides');
        const backToVisualsBtn = document.getElementById('backToVisuals');
        const retryBtn = document.getElementById('retryReview');

        if (prevSlideBtn) prevSlideBtn.click();
        else if (backToVisualsBtn) backToVisualsBtn.click();
        else if (backToSlidesBtn) backToSlidesBtn.click();
        else if (retryBtn) retryBtn.click();
        else {
            if (!this.prevBtn || !this.prevBtn.disabled) {
                this.navigate(-1);
            }
        }
    }

    loadModule(index, initialSlideIndex = 0) {
        console.log(`Loading module ${index} at slide ${initialSlideIndex}. Current contentArea HTML:`, this.contentArea.innerHTML);
        this.currentModuleIndex = index;
        this.slideIndex = initialSlideIndex;

        // Notify parent application
        window.parent.postMessage({ 
            type: 'elearning-navigation', 
            moduleIndex: index + 1, 
            action: 'loadModule' 
        }, '*');

        const module = this.data.modules[index];

        this.moduleTitle.innerText = module.title;
        this.updateNavigationButtons();

        this.contentArea.innerHTML = '';
        console.log('Content area cleared. About to render module type:', module.type);
        if (module.type === 'lesson') {
            this.renderSlides(module, this.slideIndex);
        } else if (module.type === 'quiz') {
            this.renderQuizModule(module);
        }
    }

    renderSlides(module, slideIndex) {
                this.slideIndex = slideIndex; // Update the app's current slide index
                console.log(`[DEBUG] renderSlides: module ID = ${module.id}, current slideIndex (input) = ${slideIndex}, stored this.slideIndex (after update) = ${this.slideIndex}, module.slides.length = ${module.slides.length}`);

                const slide = module.slides[this.slideIndex]; // Use this.slideIndex for consistency
        this.contentArea.innerHTML = `
            <div class="slides-container">
                <div class="slide-progress">Slide ${slideIndex + 1} de ${module.slides.length}</div>
                <div class="slide-card">
                    <h2 class="slide-title">${slide.title}</h2>
                    <div class="slide-content">${slide.content}</div>
                </div>
                <div class="slide-actions">
                    <button id="prevSlide" class="btn btn-secondary" ${this.slideIndex === 0 ? 'disabled' : ''}>Anterior</button>
                    ${this.slideIndex + 1 < module.slides.length
                        ? `<button id="nextSlide" class="btn btn-primary">Próximo</button>`
                        : `<button id="startVideo" class="btn btn-primary">Ver Visualização Técnica</button>`
                    }
                </div>
            </div>
        `;

        if (document.getElementById('prevSlide')) {
            document.getElementById('prevSlide').onclick = () => {
                console.log(`[DEBUG] prevSlide clicked. Current slideIndex: ${this.slideIndex}. Calling renderSlides with module ID = ${module.id}, new slideIndex = ${this.slideIndex - 1}`);
                this.renderSlides(module, this.slideIndex - 1);
            };
        }
        if (document.getElementById('nextSlide')) {
            document.getElementById('nextSlide').onclick = () => {
                console.log(`[DEBUG] nextSlide clicked. Current slideIndex: ${this.slideIndex}. Calling renderSlides with module ID = ${module.id}, new slideIndex = ${this.slideIndex + 1}`);
                this.renderSlides(module, this.slideIndex + 1);
            };
        }

        if (document.getElementById('startVideo')) {
            document.getElementById('startVideo').onclick = () => this.renderTechnicalVideo(module);
        }
    }

    renderTechnicalVideo(module) {
        this.contentArea.innerHTML = `
            <div class="video-container">
                <div class="video-header">
                    <h2>📽️ Visualização Técnica: ${module.title}</h2>
                </div>
                <div class="simulation-stage" id="simStage"></div>
                <div class="video-footer">
                    <button id="backToSlides" class="btn btn-secondary">Anterior (Slides)</button>
                    <button id="startDynamicsView" class="btn btn-primary">Ver Dinâmica do Processo</button>
                </div>
            </div>
        `;

        this.runSimulation(module.id);
        document.getElementById('backToSlides').onclick = () => this.renderSlides(module, this.slideIndex);

        if (module.interactive && module.interactive.type === 'simulator') {
            document.getElementById('startDynamicsView').textContent = 'Ver Simulador de Parâmetros';
            document.getElementById('startDynamicsView').onclick = () => this.renderSimulator(module);
        } else if (module.troubleshooting) {
            document.getElementById('startDynamicsView').textContent = 'Ver Exercício de Troubleshooting';
            document.getElementById('startDynamicsView').onclick = () => this.renderTroubleshooting(module);
        } else {
            document.getElementById('startDynamicsView').onclick = () => this.renderDynamicsVisualization(module);
        }
    }

    renderDynamicsVisualization(module) {
        this.contentArea.innerHTML = `
            <div class="video-container">
                <div class="video-header">
                    <h2>🎬 Dinâmica do Processo em Tempo Real</h2>
                </div>
                <div class="dynamics-stage" id="dynamicsStage"></div>
                <div class="video-footer">
                    <button id="backToVisuals" class="btn btn-secondary">Anterior (Visualização)</button>
                    <button id="startTroubleshooting" class="btn btn-primary">Continuar para Troubleshooting</button>
                </div>
            </div>
        `;

        this.runDynamicsSimulation(module.id);
        document.getElementById('backToVisuals').onclick = () => this.renderTechnicalVideo(module);
        if (module.troubleshooting) {
            document.getElementById('startTroubleshooting').onclick = () => this.renderTroubleshooting(module);
        } else {
            document.getElementById('startTroubleshooting').textContent = 'Ir para a Avaliação';
            document.getElementById('startTroubleshooting').onclick = () => this.renderQuizModule(module);
        }
    }

    runDynamicsSimulation(moduleId) {
        const stage = document.getElementById('dynamicsStage');
        if (!stage) return;

        if (moduleId === 1) {
            stage.innerHTML = `
                <div class="dynamics-m1-interactive">
                    <video class="dynamics-video" autoplay loop>
                                <source src="/courses/formar-opencode/assets/PixVerse_V5.5_Extend_360P_Mais_lento_e_durante1.mp4" type="video/mp4">
                                Seu navegador não suporta vídeo HTML5.
                                <img src="/courses/formar-opencode/assets/extruder_clean.png" class="fallback-image" alt="Diagrama Técnico Extrusora">
                    </video>
                    <div class="hotspots-overlay dynamics-overlay">
                        <div class="hotspot dynamics-hotspot" style="top: 10%; left: 20%;" data-info="Zona de Alimentação: Entrada de matérias-primas secas e líquidos. Primeira zona de mistura e transporte.">?</div>
                        <div class="hotspot dynamics-hotspot" style="top: 48%; left: 30%;" data-info="Zona de Compressão: Aumento progressivo da pressão e temperatura. Homogeneização da massa em andamento.">?</div>
                        <div class="hotspot dynamics-hotspot" style="top: 48%; left: 45%;" data-info="Zona de Cozimento: Temperatura máxima (120-180°C). Gelatinização do amido e desenvolvimento de características organolépticas.">?</div>
                        <div class="hotspot dynamics-hotspot" style="top: 48%; left: 80%;" data-info="Zona de Expulsão (Die): Queda abrupta de pressão. Expansão violenta e instantânea pela libertação de vapor.">?</div>
                        <div class="hotspot dynamics-hotspot" style="top: 68%; left: 90%;" data-info="Produto Final: Estrutura celular expandida com ar encapsulado. Textura crocante e densidade controlada.">?</div>
                    </div>
                    <div id="dynPopup" class="sim-popup dynamics-popup" style="display: none;">
                        <div class="popup-content">
                            <span class="popup-close">&times;</span>
                            <p id="dynPopupText"></p>
                        </div>
                    </div>
                </div>`;
            this.initInteractiveDynamics();
        } else if (moduleId === 2) {
            stage.innerHTML = `
                <div class="dynamics-m2-interactive">
                    <video class="dynamics-video" autoplay loop controls>
                                <source src="/courses/formar-opencode/assets/Extrusora_de_Duplo_Parafuso-nologo.mp4" type="video/mp4">
                                Seu navegador não suporta vídeo HTML5.
                                <img src="/courses/formar-opencode/assets/extruder_clean.png" class="fallback-image" alt="Diagrama Técnico de Equipamento">
                    </video>
                </div>`;
        } else if (moduleId === 3) {
            stage.innerHTML = `
                <div class="dynamics-m3-interactive">
                                <img src="/courses/formar-opencode/assets/placeholder_hmi.png" class="base-image diagram-bg" alt="Diagrama HMI da Extrusora">
                    <div class="hotspots-overlay dynamics-overlay">
                        <div class="hotspot dynamics-hotspot" style="top: 20%; left: 30%;" data-info="HMI: Painel de Controle Principal. Interface para monitorização e ajuste de parâmetros.">?</div>
                        <div class="hotspot dynamics-hotspot" style="top: 50%; left: 60%;" data-info="Parâmetro de Temperatura: Controlo e visualização da temperatura em tempo real.">?</div>
                    </div>
                    <div id="dynPopup" class="sim-popup dynamics-popup" style="display: none;">
                        <div class="popup-content">
                            <span class="popup-close">&times;</span>
                            <p id="dynPopupText"></p>
                        </div>
                    </div>
                </div>`;
            this.initInteractiveDynamics();
        } else if (moduleId === 4) {
            stage.innerHTML = `
                <div class="dynamics-m4-interactive">
                                <img src="/courses/formar-opencode/assets/placeholder_cereais.png" class="base-image diagram-bg" alt="Cereais Expandidos">
                    <div class="hotspots-overlay dynamics-overlay">
                        <div class="hotspot dynamics-hotspot" style="top: 25%; left: 35%;" data-info="Grão de Milho Extrudido: Exemplo de cereal expandido com textura aerada.">?</div>
                        <div class="hotspot dynamics-hotspot" style="top: 55%; left: 65%;" data-info="Arroz Extrudido: Pequenos grãos com alta capacidade de absorção.">?</div>
                    </div>
                    <div id="dynPopup" class="sim-popup dynamics-popup" style="display: none;">
                        <div class="popup-content">
                            <span class="popup-close">&times;</span>
                            <p id="dynPopupText"></p>
                        </div>
                    </div>
                </div>`;
            this.initInteractiveDynamics();
        } else {
            stage.innerHTML = `<div class="placeholder-sim">Simulação em desenvolvimento para os próximos módulos.</div>`;
        }
    }

    initInteractiveDynamics() {
        const hotspots = document.querySelectorAll('.dynamics-hotspot');
        const popup = document.getElementById('dynPopup');
        const popupText = document.getElementById('dynPopupText');
        const close = document.querySelector('.dynamics-popup .popup-close');

        hotspots.forEach(hs => {
            const hotspotId = `${this.currentModuleIndex}-dynamics-${hs.dataset.info.substring(0, 20)}`;
                if (this.dynamicsHotspotVisited.has(hotspotId)) {
                hs.classList.add('visited');
            }

            hs.onclick = (e) => {
                e.stopPropagation();
                popupText.innerText = hs.dataset.info;
                popup.style.display = 'flex';
                hs.classList.add('visited');
                this.dynamicsHotspotVisited.set(hotspotId, true);
            };
        });

        if (close) close.onclick = () => { popup.style.display = 'none'; };
        if (popup) popup.onclick = (e) => { if (e.target === popup) popup.style.display = 'none'; };
    }

    renderSimulator(module) {
        const interactiveData = module.interactive;
        if (!interactiveData) {
            this.showNotification('Simulador não disponível para este módulo.', 'warning');
            this.renderTroubleshooting(module); // Fallback to troubleshooting if simulator is missing
            return;
        }

        const currentParams = {};
        interactiveData.params.forEach(p => {
            currentParams[p.id] = p.default;
        });

        const updateSimulatorUI = () => {
            let feedbackMessages = [];
            let statusClass = 'info'; // Default status

            const checkThreshold = (paramId, value, optimal, warning) => {
                if (value < optimal[0] || value > optimal[1]) {
                    if (value < warning[0] || value > warning[1]) {
                        return 'critical'; // Outside warning range
                    }
                    return 'warning'; // Outside optimal, but within warning
                }
                return 'optimal';
            };

            // Check SME
            const smeStatus = checkThreshold('sme', currentParams.sme, interactiveData.thresholds.optimal.sme, interactiveData.thresholds.warning.sme);
            if (smeStatus === 'critical') {
                feedbackMessages.push(interactiveData.feedback.lowExpansion);
                statusClass = 'error';
            } else if (smeStatus === 'warning') {
                feedbackMessages.push(interactiveData.feedback.lowExpansion); // Re-using for simplicity
                statusClass = statusClass === 'error' ? 'error' : 'warning';
            }

            // Check Temperature
            const tempStatus = checkThreshold('temp', currentParams.temp, interactiveData.thresholds.optimal.temp, interactiveData.thresholds.warning.temp);
            if (tempStatus === 'critical') {
                feedbackMessages.push(interactiveData.feedback.lowTemp);
                statusClass = 'error';
            } else if (tempStatus === 'warning') {
                feedbackMessages.push(interactiveData.feedback.lowTemp); // Re-using for simplicity
                statusClass = statusClass === 'error' ? 'error' : 'warning';
            }
            
            // Check Humidity (inverted logic: high humidity can cause low expansion)
            const humidityStatus = checkThreshold('humidity', currentParams.humidity, interactiveData.thresholds.optimal.humidity, interactiveData.thresholds.warning.humidity);
            if (humidityStatus === 'critical' && currentParams.humidity > interactiveData.thresholds.optimal.humidity[1]) {
                feedbackMessages.push(interactiveData.feedback.lowExpansion); // High humidity -> low expansion
                statusClass = 'error';
            } else if (humidityStatus === 'warning' && currentParams.humidity > interactiveData.thresholds.optimal.humidity[1]) {
                feedbackMessages.push(interactiveData.feedback.lowExpansion);
                statusClass = statusClass === 'error' ? 'error' : 'warning';
            }

            // Check RPM (too low RPM can cause low SME and low expansion)
            const rpmStatus = checkThreshold('rpm', currentParams.rpm, interactiveData.thresholds.optimal.rpm, interactiveData.thresholds.warning.rpm);
            if (rpmStatus === 'critical' && currentParams.rpm < interactiveData.thresholds.optimal.rpm[0]) {
                feedbackMessages.push(interactiveData.feedback.lowExpansion); // Low RPM -> low SME -> low expansion
                statusClass = 'error';
            } else if (rpmStatus === 'warning' && currentParams.rpm < interactiveData.thresholds.optimal.rpm[0]) {
                feedbackMessages.push(interactiveData.feedback.lowExpansion);
                statusClass = statusClass === 'error' ? 'error' : 'warning';
            }

            if (feedbackMessages.length === 0) {
                feedbackMessages.push(interactiveData.feedback.optimal);
                statusClass = 'success';
            }

            document.getElementById('simulatorFeedback').innerHTML = `<p class="${statusClass}">${feedbackMessages.join('<br>')}</p>`;
        };


        this.contentArea.innerHTML = `
            <div class="simulator-container">
                <div class="simulator-header">
                    <h2>⚙️ ${interactiveData.title}</h2>
                    <p>${interactiveData.description}</p>
                </div>
                <div class="params-grid">
                    ${interactiveData.params.map(p => `
                        <div class="param-item">
                            <label for="${p.id}">${p.name}: <span id="${p.id}Value">${currentParams[p.id]} ${p.unit}</span></label>
                            <input type="range" id="${p.id}" min="${p.min}" max="${p.max}" value="${currentParams[p.id]}" step="1" class="slider">
                        </div>
                    `).join('')}
                </div>
                <div id="simulatorFeedback" class="simulator-feedback">
                    <p class="info">Ajuste os parâmetros para otimizar o processo.</p>
                </div>
                <div class="simulator-actions">
                    <button id="prevSim" class="btn btn-secondary">Anterior</button>
                    <button id="nextSim" class="btn btn-primary">Avançar</button>
                </div>
            </div>
        `;

        interactiveData.params.forEach(p => {
            const slider = document.getElementById(p.id);
            const valueSpan = document.getElementById(`${p.id}Value`);
            slider.oninput = (e) => {
                currentParams[p.id] = parseInt(e.target.value);
                valueSpan.innerText = `${currentParams[p.id]} ${p.unit}`;
                updateSimulatorUI();
            };
        });

        document.getElementById('prevSim').onclick = () => this.renderTechnicalVideo(module);
        document.getElementById('nextSim').onclick = () => {
            if (module.troubleshooting) {
                this.renderTroubleshooting(module);
            } else {
                this.renderQuizModule(module); // Fallback to quiz if troubleshooting is missing
            }
        };

        updateSimulatorUI(); // Initial UI update

    }

    renderTroubleshooting(module) {
        const troubleshootingData = module.troubleshooting;
        if (!troubleshootingData) {
            this.showNotification('Exercício de Troubleshooting não disponível para este módulo.', 'warning');
            this.renderQuizModule(module); // Fallback to quiz if troubleshooting is missing
            return;
        }

        let currentScenarioIndex = 0;
        let score = 0;

        const showScenario = (sIndex) => {
            const scenario = troubleshootingData.scenarios[sIndex];
            this.contentArea.innerHTML = `
                <div class="troubleshooting-container">
                    <div class="troubleshooting-header">
                        <h2>🔍 ${troubleshootingData.title}</h2>
                        <p>${troubleshootingData.description}</p>
                        <div class="troubleshooting-progress">Cenário ${sIndex + 1} de ${troubleshootingData.scenarios.length}</div>
                    </div>
                    <div class="scenario-card">
                        <h3>${scenario.name}</h3>
                        <p><b>Sintomas:</b> ${scenario.symptoms.join(', ')}</p>
                        <div class="options-grid" id="troubleshootingOptions">
                            ${scenario.options.map((opt, i) => `
                                <div class="troubleshooting-option">
                                    <input type="radio" id="cause${sIndex}-${i}" name="cause" value="${opt.cause}">
                                    <label for="cause${sIndex}-${i}">Causa: ${opt.cause}</label><br>
                                    <input type="radio" id="solution${sIndex}-${i}" name="solution" value="${opt.solution}">
                                    <label for="solution${sIndex}-${i}">Solução: ${opt.solution}</label>
                                </div>
                            `).join('')}
                        </div>
                        <div id="troubleshootingFeedback" class="troubleshooting-feedback-box" style="display: none;">
                            <p id="troubleshootingFeedbackText"></p>
                            <button id="nextTroubleshootingBtn" class="btn btn-primary">Continuar</button>
                        </div>
                        <button id="submitTroubleshooting" class="btn btn-primary">Verificar Resposta</button>
                    </div>
                </div>
            `;

            const optionsGrid = document.getElementById('troubleshootingOptions');
            const submitBtn = document.getElementById('submitTroubleshooting');
            const feedbackBox = document.getElementById('troubleshootingFeedback');
            const feedbackText = document.getElementById('troubleshootingFeedbackText');
            const nextBtn = document.getElementById('nextTroubleshootingBtn');

            submitBtn.onclick = () => {
                const selectedCause = document.querySelector('input[name="cause"]:checked')?.value;
                const selectedSolution = document.querySelector('input[name="solution"]:checked')?.value;

                if (!selectedCause || !selectedSolution) {
                    this.showNotification('Por favor, selecione uma causa e uma solução.', 'warning');
                    return;
                }

                const isCorrect = (selectedCause === scenario.correctCause) && (selectedSolution === scenario.correctSolution);

                if (isCorrect) {
                    score++;
                    feedbackText.innerHTML = '<span style="color: var(--success); font-weight: bold;">Correto!</span>';
                } else {
                    feedbackText.innerHTML = `<span style="color: var(--error); font-weight: bold;">Incorreto.</span><br>Causa correta: <b>${scenario.correctCause}</b><br>Solução correta: <b>${scenario.correctSolution}</b>`;
                }

                optionsGrid.querySelectorAll('input').forEach(input => input.disabled = true);
                submitBtn.disabled = true;
                feedbackBox.style.display = 'block';

                nextBtn.onclick = () => {
                    if (sIndex + 1 < troubleshootingData.scenarios.length) {
                        showScenario(sIndex + 1);
                    } else {
                        this.handleTroubleshootingResult(module, score, troubleshootingData.scenarios.length);
                    }
                };
            };

            document.getElementById('prevTroubleshooting').onclick = () => {
                // Logic to go back to the previous view (dynamics visualization or simulator)
                if (module.interactive && module.interactive.type === 'simulator') {
                    this.renderSimulator(module);
                } else {
                    this.renderDynamicsVisualization(module);
                }
            };

            document.getElementById('nextTroubleshooting').onclick = () => {
                this.renderQuizModule(module);
            };
        };

        showScenario(currentScenarioIndex);

    }

    handleTroubleshootingResult(module, correctCount, totalScenarios) {
        const percentage = Math.round((correctCount / totalScenarios) * 100);
        const passed = percentage >= 80; // Assuming 80% passing score for troubleshooting

        this.contentArea.innerHTML = `
            <div class="feedback-card">
                <span class="feedback-icon">${passed ? '✅' : '❌'}</span>
                <h2 class="feedback-title" style="color: ${passed ? 'var(--success)' : 'var(--error)'}">${passed ? 'Exercício Concluído!' : 'Rever Conceitos'}</h2>
                <p class="feedback-message">Atingiste ${percentage}% neste exercício. ${passed ? 'Podes avançar para a avaliação.' : 'Tenta rever os conceitos e tentar novamente.'}</p>
                <div class="feedback-actions">
                    <button class="btn btn-primary" id="startQuiz">Ir para a Avaliação</button>
                </div>
            </div>
        `;
        document.getElementById('startQuiz').onclick = () => this.renderQuizModule(module);
    }


    runSimulation(moduleId) {
        const stage = document.getElementById('simStage');
        if (!stage) return;

        if (moduleId === 1) {
            stage.innerHTML = `
                <div class="sim-m1-interactive">
                                <img src="/courses/formar-opencode/assets/extruder_clean.png" class="base-image diagram-bg" alt="Diagrama Técnico Extrusora">
                    <div class="hotspots-overlay">
                        <div class="hotspot" style="top: 10%; left: 32%;" data-info="Alimentação e Mistura: Entrada de farinhas (~10% H2O) e líquidos (Água, Óleo).">?</div>
                        <div class="hotspot" style="top: 42%; left: 45%;" data-info="Tratamento Térmico e Pressão: A massa é cozida entre 120-180°C sob alta pressão (100-150 bars).">?</div>
                        <div class="hotspot" style="top: 62%; left: 58%;" data-info="Expansão Final: A queda abrupta de pressão na saída causa a expansão instantânea e libertação de vapor.">?</div>
                        <div class="hotspot" style="top: 85%; left: 82%;" data-info="Estrutura do Produto (Células de Ar): Representação da estrutura final expandida, onde o ar fica encapsulado criando a textura crocante.">?</div>
                    </div>
                    <div id="simPopup" class="sim-popup" style="display: none;">
                        <div class="popup-content">
                            <span class="popup-close">&times;</span>
                            <p id="popupText"></p>
                        </div>
                    </div>
                </div>`;
            this.initInteractiveM1();
        } else if (moduleId === 2) {
            stage.innerHTML = `
                <div class="sim-m2-interactive">
                                <img src="/courses/formar-opencode/assets/diagrama_extrusora.png" class="base-image diagram-bg" style="width:100%;object-fit:contain;" alt="Diagrama técnico de extrusora">
                    <div class="hotspots-overlay">
                        <div class="hotspot" style="top: 15%; left: 12%;" data-info="Alimentador: Sistema de dosagem de sólidos e líquidos. Pode ser gravimétrico (perda de peso) ou volumétrico para fluxo preciso.">?</div>
                        <div class="hotspot" style="top: 30%; left: 28%;" data-info="Pré-condicionador: Hidrata e pré-aquece a farinha usando vapor. Aumenta a capacidade de produção e melhora a qualidade.">?</div>
                        <div class="hotspot" style="top: 50%; left: 35%;" data-info="TSE (Extrusor de Dupla Rosca): Roscas co-rotantes intermeshing que atuam como bomba de deslocamento positivo e cozinham a massa.">?</div>
                        <div class="hotspot" style="top: 50%; left: 60%;" data-info="Barril Modular: Secções de aquecimento e arrefecimento com controlo individual de temperatura via jaquetas de água.">?</div>
                        <div class="hotspot" style="top: 75%; left: 25%;" data-info="Cabeçote (Die Head): Composto pela placa de distribuição e placa de matriz. Define a forma e o fluxo final do produto.">?</div>
                        <div class="hotspot" style="top: 85%; left: 72%;" data-info="Cortador: Lâminas rotativas que cortam o produto à face da matriz, definindo o comprimento final.">?</div>
                    </div>
                    <div id="simPopup" class="sim-popup" style="display: none;">
                        <div class="popup-content">
                            <span class="popup-close">&times;</span>
                            <p id="popupText"></p>
                        </div>
                    </div>
                </div>`;
            this.initInteractiveM2();
        } else {
            stage.innerHTML = `<div class="placeholder-sim">Simulação em desenvolvimento para os próximos módulos.</div>`;
        }
    }

    initInteractiveM1() {
        const hotspots = document.querySelectorAll('.hotspot');
        const popup = document.getElementById('simPopup');
        const popupText = document.getElementById('popupText');
        const close = document.querySelector('.sim-popup .popup-close');

        hotspots.forEach(hs => {
            const hotspotId = `${this.currentModuleIndex}-static-${hs.dataset.info.substring(0, 20)}`;
                if (this.hotspotVisited.has(hotspotId)) {
                hs.classList.add('visited');
            }

            hs.onclick = (e) => {
                e.stopPropagation();
                popupText.innerText = hs.dataset.info;
                popup.style.display = 'flex';
                hs.classList.add('visited');
                this.hotspotVisited.set(hotspotId, true);
            };
        });

        if (close) close.onclick = () => { popup.style.display = 'none'; };
        if (popup) popup.onclick = (e) => { if (e.target === popup) popup.style.display = 'none'; };
    }

    initInteractiveM2() {
        // Mesmo comportamento que M1
        this.initInteractiveM1();
    }

    renderQuizModule(module) {
        // Set up the quiz session with a randomized subset of 5 questions
        console.log(`Rendering quiz for module ${module.id}.`);
        // Use all questions for the quiz, not just a subset
        const questionsCopy = JSON.parse(JSON.stringify(module.quiz.questions));
        this.shuffleArray(questionsCopy);

        this.quizSession = questionsCopy.map(q => {
            const correctText = q.options[q.correctIndex];
            this.shuffleArray(q.options);
            q.correctIndex = q.options.indexOf(correctText);
            return q;
        });

        let score = 0;

        const showQuestion = (qIndex) => {
            const q = this.quizSession[qIndex];
            this.contentArea.innerHTML = `
                <div class="quiz-container">
                    <div class="quiz-header">
                        <div class="quiz-progress">Pergunta ${qIndex + 1} de ${this.quizSession.length}</div>
                    </div>
                    <h2 class="question-text">${q.question}</h2>
                    <div class="options-grid" id="optionsGrid">
                        ${q.options.map((opt, i) => `<button class="option-btn" data-index="${i}">${opt}</button>`).join('')}
                    </div>
                    <div id="quizFeedback" class="quiz-feedback-box" style="display: none;">
                        <div class="feedback-content">
                            <p id="feedbackText"></p>
                            <p class="explanation-text"><i>${q.explanation || ''}</i></p>
                        </div>
                        <button id="nextQuestionBtn" class="btn btn-primary">Continuar</button>
                    </div>
                    <div class="quiz-actions">
                        <button id="prevQuiz" class="btn btn-secondary">Anterior</button>
                        <button id="nextQuiz" class="btn btn-primary">Avançar</button>
                    </div>
                </div>
            `;

            const optionsGrid = document.getElementById('optionsGrid');
            const feedbackBox = document.getElementById('quizFeedback');
            const feedbackText = document.getElementById('feedbackText');
            const nextQuestionBtn = document.getElementById('nextQuestionBtn');
            const prevQuizBtn = document.getElementById('prevQuiz');
            const nextQuizBtn = document.getElementById('nextQuiz');

            this.contentArea.querySelectorAll('.option-btn').forEach(btn => {
                btn.onclick = () => {
                    const selectedIdx = parseInt(btn.dataset.index);
                    const isCorrect = selectedIdx === q.correctIndex;

                    if (isCorrect) {
                        score++;
                        btn.style.borderColor = 'var(--success)';
                        btn.style.background = 'rgba(16, 185, 129, 0.1)';
                        feedbackText.innerHTML = '<span style="color: var(--success); font-weight: bold;">Correto!</span>';
                    } else {
                        btn.style.borderColor = 'var(--error)';
                        btn.style.background = 'rgba(239, 68, 68, 0.1)';
                        feedbackText.innerHTML = `<span style="color: var(--error); font-weight: bold;">Incorreto.</span> A resposta certa era: <b>${q.options[q.correctIndex]}</b>`;
                    }

                    // Disable all options
                    this.contentArea.querySelectorAll('.option-btn').forEach(b => b.disabled = true);

                    // Show feedback and next button
                    feedbackBox.style.display = 'block';

                    nextQuestionBtn.onclick = () => {
                        if (qIndex + 1 < this.quizSession.length) showQuestion(qIndex + 1);
                        else this.handleQuizResult(module, score);
                    };
                };
            });

            if (prevQuizBtn) {
                prevQuizBtn.onclick = () => {
                    if (qIndex > 0) {
                        showQuestion(qIndex - 1);
                    } else {
                        // Go back to troubleshooting if it exists for this module, otherwise go to previous module
                        if (module.troubleshooting) {
                            this.renderTroubleshooting(module);
                        } else if (module.interactive && module.interactive.type === 'simulator') {
                            this.renderSimulator(module);
                        } else {
                            this.navigate(-1); // Fallback to previous module if no interactive elements
                        }
                    }

                };
            }

            if (nextQuizBtn) {
                nextQuizBtn.onclick = () => {
                    if (qIndex + 1 < this.quizSession.length) {
                        showQuestion(qIndex + 1);
                    } else {
                        this.navigate(1); // Go to next module
                    }
                };
            }
        };
        showQuestion(0);
    }

    handleQuizResult(module, correctCount) {
        const totalQuestions = this.quizSession.length;
        const percentage = Math.round((correctCount / totalQuestions) * 100);
        const passingScore = module.quiz.passingScore;
        const passed = percentage >= passingScore;

        module.quizAttempts = (module.quizAttempts || 0) + 1;
        module.lastQuizScore = percentage; // Save the last quiz score

        this.contentArea.innerHTML = `
            <div class="feedback-card">
                <span class="feedback-icon">${passed ? '🎉' : '🔄'}</span>
                <h2 class="feedback-title" style="color: ${passed ? 'var(--success)' : 'var(--error)'}">${passed ? 'Aprovado!' : 'Reprovado'}</h2>
                <p class="feedback-message">Atingiste ${percentage}%. ${passed ? 'Podes avançar.' : 'Precisas de atingir 80% para concluir o módulo.'}</p>
                <div class="feedback-actions">
                    ${passed ? `<button class="btn btn-primary" id="finishModule">Continuar</button>` : `<button class="btn btn-secondary" id="retryReview">Repetir Módulo</button>`}
                </div>
            </div>
        `;

        // Always notify parent of module progress, regardless of pass/fail
        window.parent.postMessage({ 
            type: 'elearning-navigation', 
            moduleIndex: this.currentModuleIndex + 1, 
            action: 'moduleProgress',
            score: percentage 
        }, '*');

        if (passed) {
            document.getElementById('finishModule').onclick = () => this.navigate(1);
        } else {
            document.getElementById('retryReview').onclick = () => this.loadModule(this.currentModuleIndex);
        }
    }

    unlockNext() {
        if (this.currentModuleIndex + 1 < this.data.modules.length) {
            const nextMod = this.data.modules[this.currentModuleIndex + 1];
            if (nextMod.status === 'locked') nextMod.status = 'pending';
        }
        this.updateNavigationButtons();
    }

    updateNavigationButtons() {
        const module = this.data.modules[this.currentModuleIndex];
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentModuleIndex === 0;
        }
        
        const nextModule = this.data.modules[this.currentModuleIndex + 1];
        const isNextDisabled = !nextModule || (nextModule.status === 'locked' && module.status !== 'completed');
        
        if (this.nextBtn) {
            this.nextBtn.disabled = isNextDisabled;
        }
        console.log(`[DEBUG] updateNavigationButtons: currentModule=${this.currentModuleIndex}, nextDisabled=${isNextDisabled}`);
    }

    navigate(direction) {
        console.log(`[DEBUG] navigate: direction=${direction}, currentModuleIndex=${this.currentModuleIndex}`);
        const nextIndex = this.currentModuleIndex + direction;
        if (nextIndex >= 0 && nextIndex < this.data.modules.length) {
            const nextModule = this.data.modules[nextIndex];
            console.log(`[DEBUG] target module status: ${nextModule.status}`);
            if (nextModule.status !== 'locked' || direction < 0) {
                this.loadModule(nextIndex);
            } else {
                console.log('[DEBUG] target module is locked');
            }
        }
    }


}

window.addEventListener('DOMContentLoaded', () => {
    try {
        new TrainingApp(); // Apenas inicializa a aplicação
    } catch (error) {
        console.error('Erro ao inicializar a aplicação:', error);
        const overlay = document.querySelector('.loading-overlay');
        if (overlay) {
            overlay.innerHTML = `<div class="spinner"></div><p style="color: red;">Erro: ${error.message}</p>`;
        }
    }
});

function removeLoadingOverlay() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }
}
