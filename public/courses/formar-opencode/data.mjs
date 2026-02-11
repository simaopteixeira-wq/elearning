export const courseData = {
    title: "Mestre em Extrusão: Formação Técnica",
    modules: [
        {
            id: 1,
            title: "Introdução à Extrusão",
            type: "lesson",
            slides: [
                {
                    title: "O que é a Extrusão?",
                    content: "A extrusão é um processo de processamento contínuo que combina várias operações unitárias: mistura, amassamento, cozimento, moldagem e expansão. É um sistema altamente eficiente usado na produção de snacks e cereais."
                },
                {
                    title: "Operações Unitárias",
                    content: "Dentro de um extrusor, o material passa por: <br>1. Homogeneização<br>2. Gelatinização de amidos<br>3. Desenvolvimento de sabor<br>4. Pressurização<br>5. Expansão final no die."
                },
                {
                    title: "O Papel do Amido",
                    content: "O amido é o principal componente estrutural. Durante a extrusão, ele sofre <b>Gelatinização</b> (quebra da estrutura granulada) e, em casos de alto cisalhamento, <b>Dextrinização</b>."
                },
                {
                    title: "Energia no Processo: SME",
                    content: "<b>SME (Specific Mechanical Energy)</b>: Representa a energia mecânica dissipada pelo atrito entre as roscas e o produto. É fundamental para o cozimento mecânico."
                },
                {
                    title: "Energia no Processo: STE",
                    content: "<b>STE (Specific Thermal Energy)</b>: É a energia térmica adicionada via vapor ou aquecimento das camisas do barril. Complementa o SME no processo de cozimento."
                },
                {
                    title: "Matérias-Primas Comuns",
                    content: "Os principais ingredientes incluem farinhas nativas, sêmolas, proteínas, fibras e amidos. A composição afeta diretamente a viscosidade e a expansão."
                },
                {
                    title: "Influência da Humidade",
                    content: "O aumento do nível de humidade geralmente <b>diminui a viscosidade</b> do fundido, resultando em menor pressão e, frequentemente, menor expansão (puffing)."
                },
                {
                    title: "Tempo de Residência",
                    content: "O tempo que o material passa dentro do extrusor (típico 40-120s) determina o histórico térmico e mecânico, afetando a qualidade final do produto."
                },
                {
                    title: "Segmentos de Mercado",
                    content: "A extrusão atende a: Snacks, Cereais matinais (RTE), Alimentos para animais (Petfood), e massas alimentícias."
                },
                {
                    title: "Modificação de Características",
                    content: "Através do ajuste de parâmetros, podemos controlar a Forma, Cor, Gosto, Densidade Aparente e Textura do produto final."
                }
            ],
            video: {
                title: "Dinâmica de Processo",
                description: "Análise do fluxo termomecânico dentro da câmara de extrusão."
            },
            quiz: {
                passingScore: 80,
                questions: [
                    {
                        question: "O que significa a sigla SME no contexto da extrusão?",
                        options: ["Sistema de Mistura Especial", "Specific Mechanical Energy", "Small Mechanical Engine", "Suporte de Manutenção Externa"],
                        correctIndex: 1,
                        explanation: "SME refere-se à energia mecânica transferida do motor para a massa através do atrito."
                    },
                    {
                        question: "Qual o principal componente que garante a estrutura expandida nos cereais?",
                        options: ["Gordura", "Sal", "Amido", "Açúcar"],
                        correctIndex: 2,
                        explanation: "O amido, ao gelatinizar e expandir, cria a matriz celular do produto."
                    },
                    {
                        question: "Como o aumento da humidade geralmente afeta a viscosidade no extrusor?",
                        options: ["Aumenta a viscosidade", "Diminui a viscosidade", "Não tem efeito", "Torna o material sólido"],
                        correctIndex: 1,
                        explanation: "A água atua como um lubrificante/plastificante, reduzindo a fricção e a viscosidade."
                    },
                    {
                        question: "O que acontece com o amido durante o processo de gelatinização?",
                        options: ["Ele torna-se cristalino", "A sua estrutura granulada é quebrada", "Ele desaparece", "Transforma-se em proteína"],
                        correctIndex: 1,
                        explanation: "A energia térmica e mecânica rompe as pontes de hidrogénio dos grânulos de amido."
                    },
                    {
                        question: "A extrusão é considerada que tipo de processo?",
                        options: ["Processo em lotes (Batch)", "Processo manual", "Processo contínuo", "Processo estático"],
                        correctIndex: 2,
                        explanation: "A extrusora opera de forma ininterrupta, transformando matéria-prima em produto continuamente."
                    },
                    {
                        question: "O que é 'Dextrinização'?",
                        options: ["Aumento do tamanho do grão de amido", "Quebra do amido devido ao alto cisalhamento", "Adição de açúcar extra", "Processo de arrefecimento"],
                        correctIndex: 1,
                        explanation: "É a fragmentação das cadeias de amido em moléculas menores (dextrinas) por cisalhamento mecânico."
                    },
                    {
                        question: "Qual a gama típica de temperatura para o cozimento no extrusor?",
                        options: ["20-50°C", "120-180°C", "300-400°C", "0-10°C"],
                        correctIndex: 1,
                        explanation: "Temperaturas acima de 120°C são necessárias para a gelatinização rápida e flash-off da água."
                    },
                    {
                        question: "O 't' em STE refere-se a que tipo de energia?",
                        options: ["Total", "Técnica", "Térmica", "Traficada"],
                        correctIndex: 2,
                        explanation: "STE (Specific Thermal Energy) é a energia providenciada via aquecimento ou vapor (térmica)."
                    },
                    {
                        question: "O que é o 'Flash-off' de humidade no die?",
                        options: ["Injeção de água", "Evaporação instantânea devido à queda de pressão", "Arrefecimento rápido", "Limpeza da matriz"],
                        correctIndex: 1,
                        explanation: "Ao sair para a pressão atmosférica, a água superaquecida transforma-se instantaneamente em vapor."
                    },
                    {
                        question: "Qual a função do tempo de residência (Retention Time)?",
                        options: ["Não tem importância", "Define o histórico térmico e mecânico da massa", "Controla o peso da embalagem", "Define a cor da máquina"],
                        correctIndex: 1,
                        explanation: "O tempo de permanência determina quanta energia a massa recebe para o cozimento."
                    },
                    {
                        question: "O que é cisalhamento (Shear)?",
                        options: ["Processo de arrefecimento", "Esforço mecânico de fricção na massa", "Adição de líquidos", "Paragem da máquina"],
                        correctIndex: 1,
                        explanation: "O cisalhamento é gerado pela rotação das roscas e é a fonte do SME."
                    },
                    {
                        question: "Qual categoria de produtos consome maior SME?",
                        options: ["Massas alimentícias", "Petfood standard", "Cereais diretamente expandidos", "Produtos cozidos a frio"],
                        correctIndex: 2,
                        explanation: "Produtos altamente expandidos requerem elevado cisalhamento para atingir baixa densidade."
                    }
                ],
                failRedirectId: 1
            },
            status: "pending"
        },
        {
            id: 2,
            title: "Introdução ao Equipamento",
            type: "lesson",
            slides: [
                {
                    title: "O Sistema de Extrusão",
                    content: "Um sistema completo inclui: Alimentadores, Pré-condicionador, Extrusor de Dupla Rosca, Cabeçote e Cortador."
                },
                {
                    title: "Alimentadores (Feeders)",
                    content: "Garantem a dosagem precisa de sólidos (farinhas) e líquidos. Podem ser volumétricos ou gravimétricos (perda de peso)."
                },
                {
                    title: "O Pré-condicionador",
                    content: "Essencial para hidratar e pré-aquecer a farinha usando vapor e água. Aumenta a capacidade de produção e melhora a qualidade do produto."
                },
                {
                    title: "Extrusor de Dupla Rosca (TSE)",
                    content: "As roscas co-rotantes são auto-limpantes e agem como uma bomba de deslocamento positivo."
                },
                {
                    title: "Design do Barril",
                    content: "Dividido em seções modulares. Cada seção pode ter controlo individual de temperatura via água de arrefecimento ou vapor/eletricidade."
                },
                {
                    title: "Elementos de Transporte",
                    content: "Roscas com passo largo movem o produto rapidamente. Passo estreito gera pressão e aumenta o preenchimento."
                },
                {
                    title: "Elementos de Amassamento (Kneading)",
                    content: "Discos em ângulos que forçam a mistura e dissipam energia mecânica (SME) para o cozimento."
                },
                {
                    title: "O Cabeçote (Die Head)",
                    content: "Composto pela placa de distribuição e a placa de matriz (die plate). Define a forma final do extrudado."
                },
                {
                    title: "O Cortador (Cutter)",
                    content: "Lâminas rotativas que cortam o produto à face da matriz. A velocidade das lâminas define o comprimento do produto."
                },
                {
                    title: "Unidade de Lubrificação",
                    content: "Crucial para o funcionamento da caixa de engrenagens (gearbox) e para a extração hidráulica das roscas."
                }
            ],
            video: {
                title: "Componentes Mecânicos",
                description: "Visão explodida das peças e sistemas de movimento."
            },
            quiz: {
                passingScore: 80,
                questions: [
                    {
                        question: "Qual a principal vantagem das roscas co-rotantes intermeshing?",
                        options: ["São mais baratas", "São auto-limpantes", "Não precisam de motor", "São feitas de plástico"],
                        correctIndex: 1,
                        explanation: "A geometria intermeshing permite que uma rosca 'limpe' a outra continuamente."
                    },
                    {
                        question: "Para que serve o pré-condicionador?",
                        options: ["Para embalar o produto", "Para moer o cereal", "Para hidratar e pré-aquecer com vapor", "Para arrefecer o extrusor"],
                        correctIndex: 2,
                        explanation: "O PC aumenta o rendimento e reduz o desgaste por pré-cozinhar a farinha."
                    },
                    {
                        question: "Quem define a forma final do produto?",
                        options: ["O motor principal", "Os alimentadores", "A placa de matriz (Die Plate)", "O pré-condicionador"],
                        correctIndex: 2,
                        explanation: "A abertura e a geometria da matriz moldam a massa na saída."
                    },
                    {
                        question: "O que acontece se aumentarmos a velocidade do cortador?",
                        options: ["O produto fica mais comprido", "O produto fica mais curto", "O produto fica mais largo", "O motor para"],
                        correctIndex: 1,
                        explanation: "Mais cortes por segundo resultam em peças mais curtas (menor comprimento)."
                    },
                    {
                        question: "Como é controlado o preenchimento do barril?",
                        options: ["Apenas pelo operador", "Pela relação entre alimentação e velocidade da rosca", "Pela cor do produto", "Pela pressão do ar"],
                        correctIndex: 1,
                        explanation: "O preenchimento depende de quão rápido o alimentador entrega produto vs a rosca o retira."
                    },
                    {
                        question: "Qual componente é responsável pela dosagem de sólidos e líquidos?",
                        options: ["O cortador", "Os alimentadores (Feeders)", "A caixa de engrenagens", "O painel elétrico"],
                        correctIndex: 1,
                        explanation: "Alimentadores gravimétricos garantem o fluxo preciso de massa/hora."
                    },
                    {
                        question: "O que geram os elementos de amassamento (kneading blocks)?",
                        options: ["Vácuo", "Pressão e dissipação de energia (SME)", "Frio", "Aumento de velocidade"],
                        correctIndex: 1,
                        explanation: "A geometria forçada dos discos gera cisalhamento e pressão local."
                    },
                    {
                        question: "Qual a função da Unidade de Lubrificação?",
                        options: ["Arrefecer o produto", "Proteger a caixa de engrenagens (gearbox)", "Misturar a massa", "Limpar o die"],
                        correctIndex: 1,
                        explanation: "Garante óleo limpo e arrefecido para as engrenagens de alta potência."
                    },
                    {
                        question: "O que é um elemento de transporte invertido (Left-hand)?",
                        options: ["Acelera o produto", "Gera um ponto de contrapressão e preenchimento local", "Inverte a cor", "Para o motor"],
                        correctIndex: 1,
                        explanation: "Roscas 'à esquerda' forçam o produto para trás, criando uma barreira de pressão."
                    },
                    {
                        question: "Qual o papel do 'Hub' ou 'Pellet Mill' no die?",
                        options: ["Centrar as roscas", "Garantir a distribuição uniforme do fluxo para os furos", "Cortar o produto", "Aquecer a gearbox"],
                        correctIndex: 1,
                        explanation: "Permite que a massa chegue a todos os furos com a mesma pressão e velocidade."
                    },
                    {
                        question: "O que é uma extrusora de Dupla Rosca (TSE)?",
                        options: ["Dois extrusores em série", "Um barril com duas roscas paralelas", "Uma rosca muito comprida", "Uma máquina de pão manual"],
                        correctIndex: 1,
                        explanation: "TSE (Twin Screw Extruder) utiliza duas roscas para maior eficiência de mistura."
                    }
                ],
                failRedirectId: 2
            },
            status: "locked"
        },
        {
            id: 3,
            title: "Controlo de Extrusão",
            type: "lesson",
            slides: [
                {
                    title: "Sistema Operacional",
                    content: "É a interface homem-máquina (HMI) que permite o controlo total da linha. Integra o PLC e os acionamentos auxiliares."
                },
                {
                    title: "Estados de Sequência",
                    content: "O controlo automático possui 6 estados: 1. Descanso, 2. Partida de motores, 3. Fase de arranque, 4. Produção, 5. Paragem, 6. Paragem Rápida."
                },
                {
                    title: "Gestão de Receitas",
                    content: "Permite guardar todos os set-points (alimentação, velocidades, temperaturas) para garantir a reprodutibilidade da qualidade."
                },
                {
                    title: "Controlo Automático de SME",
                    content: "O sistema pode ajustar automaticamente a velocidade da rosca ou a alimentação para manter um SME alvo."
                },
                {
                    title: "Controlo de Densidade",
                    content: "Módulos específicos controlam a pressão e a injeção de vapor/água para atingir a densidade desejada do snack."
                },
                {
                    title: "Monitorização de Torque",
                    content: "Crítico para proteção da máquina. O sistema reduz a alimentação se o torque exceder os limites de segurança."
                },
                {
                    title: "Mensagens vs Alarmes",
                    content: "<b>Mensagens</b>: Informativas, não param o processo. <b>Alarmes</b>: Indicam perigo imediato e podem forçar a paragem da linha."
                },
                {
                    title: "Trending",
                    content: "Gravação em tempo real de todos os parâmetros (até 48 valores por segundo) para análise de performance."
                },
                {
                    title: "Ramping",
                    content: "Mudança gradual entre o estado de arranque e a produção total para evitar instabilidades ou bloqueios."
                },
                {
                    title: "Níveis de Acesso",
                    content: "O sistema possui gestão de utilizadores com diferentes direitos para Operadores, Manutenção e Gestores."
                }
            ],
            video: {
                title: "Software de Controlo",
                description: "Demonstração da interface de controlo e parâmetros ativos."
            },
            quiz: {
                passingScore: 80,
                questions: [
                    {
                        question: "Quantos estados principais compõem a sequência de controlo?",
                        options: ["2", "4", "6", "10"],
                        correctIndex: 2
                    },
                    {
                        question: "O que o sistema faz quando deteta um excesso de torque?",
                        options: ["Aumenta a alimentação", "Reduz a alimentação ou para o processo", "Apaga as luzes", "Injeta mais farinha"],
                        correctIndex: 1
                    },
                    {
                        question: "Qual a diferença entre uma mensagem e um alarme?",
                        options: ["Nenhuma", "Mensagens são avisos, Alarmes indicam perigo e paragem", "Alarmes são mais bonitos", "Mensagens apagam os dados"],
                        correctIndex: 1
                    },
                    {
                        question: "Para que serve a função de Trending?",
                        options: ["Para ver filmes", "Para analisar o histórico de parâmetros de produção", "Para mudar a cor da HMI", "Para falar com o suporte"],
                        correctIndex: 1
                    },
                    {
                        question: "A 'Fase de Produção' é qual número na sequência?",
                        options: ["1", "4", "6", "3"],
                        correctIndex: 1
                    },
                    {
                        question: "O que acontece na 'Paragem Rápida' (Quick Stop)?",
                        options: ["A máquina abranda lentamente", "Paragem imediata de segurança", "Aumenta a velocidade", "Inicia a limpeza automática"],
                        correctIndex: 1
                    },
                    {
                        question: "O que o sistema ajusta para manter o SME alvo?",
                        options: ["A cor da massa", "Velocidade da rosca ou alimentação", "Pressão do óleo", "Temperatura da sala"],
                        correctIndex: 1
                    }
                ],
                failRedirectId: 3
            },
            status: "locked"
        },
        {
            id: 4,
            title: "Cereais Diretamente Expandidos",
            type: "lesson",
            slides: [
                {
                    title: "O que é RTE?",
                    content: "RTE significa 'Ready-To-Eat'. Cereais matinais diretamente expandidos são moldados e crescem instantaneamente na saída do extrusor."
                },
                {
                    title: "Mecanismo de Expansão",
                    content: "Ocorre devido à queda brusca de pressão no die e à evaporação instantânea da água superaquecida ('flash-off')."
                },
                {
                    title: "Fatores de Influência",
                    content: "A qualidade do cereal depende de 3 pilares: Matéria-prima (Amido), Equipamento (Configuração de rosca) e Processo (SME/TEMPO)."
                },
                {
                    title: "Importância das Fibras",
                    content: "Fibras e farelo reduzem a expansão e podem criar uma estrutura mais grosseira se não forem bem processadas."
                },
                {
                    title: "Reações Químicas",
                    content: "Durante o processo, ocorrem reações de Maillard (cor castanha) e caramelização dos açúcares, definindo o sabor."
                },
                {
                    title: "Processo",
                    content: "Produtos diretamente expandidos costumam usar processos mais curtos (8 a 16 L/D) comparado a cereais cozidos por mais tempo."
                },
                {
                    title: "Co-Extrusão",
                    content: "Técnica onde uma massa de recheio é injetada simultaneamente, criando almofadas ou tubos recheados."
                },
                {
                    title: "Pós-Processamento",
                    content: "Após o extrusor, o produto passa por Secagem (Drying), Revestimento (Coating com açúcar/vitaminas) e Arrefecimento."
                },
                {
                    title: "Design de Matriz",
                    content: "A furação da matriz deve garantir um fluxo uniforme para que todos os cereais tenham o mesmo tamanho e densidade."
                },
                {
                    title: "Controlo de Qualidade",
                    content: "Foca-se na Densidade Aparente, Crocância (Crispness), Cor e Estabilidade em leite (Bowl life)."
                }
            ],
            video: {
                title: "Expansão Máxima",
                description: "Visualização do momento de expansão e moldagem final."
            },
            quiz: {
                passingScore: 80,
                questions: [
                    {
                        question: "O que causa a expansão instantânea do cereal matinal?",
                        options: ["Pó de fermento", "Evaporação flash da água superaquecida no die", "Sucção de ar externa", "Prensagem mecânica"],
                        correctIndex: 1
                    },
                    {
                        question: "O que significa RTE?",
                        options: ["Real Time Extrusion", "Ready To Eat", "Rotation Torque Energy", "Return To Entry"],
                        correctIndex: 1
                    },
                    {
                        question: "Qual o efeito das fibras na expansão?",
                        options: ["Aumentam a expansão", "Reduzem a expansão", "Não alteram nada", "Tornam o produto transparente"],
                        correctIndex: 1
                    },
                    {
                        question: "O que é 'Bowl Life' num cereal?",
                        options: ["O tempo de vida na prateleira", "O tempo em que se mantém crocante no leite", "O tamanho da tigela", "A cor da caixa"],
                        correctIndex: 1
                    },
                    {
                        question: "Qual o processo que costuma seguir-se à extrusão no caso dos cereais matinais?",
                        options: ["Moagem", "Congelação", "Secagem e Revestimento (Coating)", "Lavagem com água"],
                        correctIndex: 2
                    },
                    {
                        question: "O que acontece se a pressão no die for muito baixa?",
                        options: ["O produto explode", "A expansão será insuficiente", "O produto derrete", "O motor acelera"],
                        correctIndex: 1
                    },
                    {
                        question: "A reação de Maillard é responsável por quê?",
                        options: ["Pela densidade", "Pelo desenvolvimento da cor e sabor", "Pela forma geométrica", "Pela limpeza das roscas"],
                        correctIndex: 1
                    }
                ],
                failRedirectId: 4
            },
            status: "locked"
        }
    ]
};