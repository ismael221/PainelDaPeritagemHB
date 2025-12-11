// Dados de exemplo para as Ordens de Serviço
const osData = [
    {
        nrOS: '2025000002',
        cliente: 'Hamech',
        previsaoEntregaPec: 'finalizado',
        previsaoEntregaItem: '15/01/2025',
        usinagem: 'finalizado',
        brunimento: 'programado',
        cromagem: 'aguardando',
        montagem: 'nao-aplica',
        teste: 'programado',
        pintura: 'nao-aplica',
        responsavel: 'João, José, Maria',
        oficina: 'oficina-1'
    },
    {
        nrOS: '2025000003',
        cliente: 'TechParts Ltda',
        previsaoEntregaPec: 'programado',
        previsaoEntregaItem: '18/01/2025',
        usinagem: 'programado',
        brunimento: 'aguardando',
        cromagem: 'finalizado',
        montagem: 'programado',
        teste: 'aguardando',
        pintura: 'finalizado',
        responsavel: 'Carlos, Ana',
        oficina: 'oficina-2'
    },
    {
        nrOS: '2025000004',
        cliente: 'Industrial Motors',
        previsaoEntregaPec: 'aguardando',
        previsaoEntregaItem: '20/01/2025',
        usinagem: 'finalizado',
        brunimento: 'finalizado',
        cromagem: 'programado',
        montagem: 'aguardando',
        teste: 'nao-aplica',
        pintura: 'aguardando',
        responsavel: 'Pedro, Lucas',
        oficina: 'oficina-3'
    },
    {
        nrOS: '2025000005',
        cliente: 'AutoService Pro',
        previsaoEntregaPec: 'programado',
        previsaoEntregaItem: '22/01/2025',
        usinagem: 'aguardando',
        brunimento: 'nao-aplica',
        cromagem: 'aguardando',
        montagem: 'finalizado',
        teste: 'programado',
        pintura: 'programado',
        responsavel: 'Marina, Roberto',
        oficina: 'oficina-1'
    }
];

// Dados de detalhes da OS (exemplo)
const osDetailsData = {
    '2025000002': [
        {
            atividade: 'Usinagem de cilindro',
            status: 'Finalizado',
            macrogrupo: 'CILINDROS',
            item: 'CIL001',
            codPlaq: 'PLQ001',
            partname: 'Cilindro Principal',
            decisao: 'Aprovado',
            justific: 'Dentro dos padrões',
            codProdu: 'PRD001',
            planejado: '10/01/2025',
            operador: 'João Silva',
            dtHoraInicial: '10/01/2025 08:00',
            dtHoraFinal: '10/01/2025 12:00'
        },
        {
            atividade: 'Brunimento',
            status: 'Programado',
            macrogrupo: 'ACABAMENTO',
            item: 'CIL001',
            codPlaq: 'PLQ001',
            partname: 'Cilindro Principal',
            decisao: 'Pendente',
            justific: 'Aguardando liberação',
            codProdu: 'PRD002',
            planejado: '16/01/2025',
            operador: 'José Santos',
            dtHoraInicial: '',
            dtHoraFinal: ''
        }
    ],
    '2025000003': [
        {
            atividade: 'Cromagem',
            status: 'Finalizado',
            macrogrupo: 'REVESTIMENTO',
            item: 'CMP001',
            codPlaq: 'PLQ002',
            partname: 'Componente Motor',
            decisao: 'Aprovado',
            justific: 'Qualidade excelente',
            codProdu: 'PRD003',
            planejado: '12/01/2025',
            operador: 'Carlos Lima',
            dtHoraInicial: '12/01/2025 07:30',
            dtHoraFinal: '12/01/2025 16:00'
        }
    ]
};

class DashboardOS {
    constructor() {
        this.filteredData = [...osData];
        this.selectedOS = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderTable();
        this.setupFilters();
    }

    bindEvents() {
        // Filtro por oficina
        const filtroOficina = document.getElementById('filtro-oficina');
        filtroOficina.addEventListener('change', () => this.applyFilters());

        // Filtros de status
        const statusFilters = document.querySelectorAll('.status-filter input[type="checkbox"]');
        statusFilters.forEach(filter => {
            filter.addEventListener('change', () => this.applyFilters());
        });

        // Seleção de linha da tabela
        document.addEventListener('click', (e) => {
            if (e.target.closest('tbody tr')) {
                const row = e.target.closest('tbody tr');
                const osNumber = row.dataset.osNumber;
                if (osNumber) {
                    this.selectOS(osNumber, row);
                }
            }
        });
    }

    setupFilters() {
        // Aplicar filtros padrão
        this.applyFilters();
    }

    applyFilters() {
        const oficina = document.getElementById('filtro-oficina').value;
        const activeStatuses = [];
        
        document.querySelectorAll('.status-filter input[type="checkbox"]:checked').forEach(checkbox => {
            activeStatuses.push(checkbox.id);
        });

        this.filteredData = osData.filter(os => {
            // Filtro por oficina
            if (oficina && os.oficina !== oficina) {
                return false;
            }

            // Verificar se pelo menos um dos status está ativo nos filtros
            const osStatuses = [
                os.previsaoEntregaPec,
                os.usinagem,
                os.brunimento,
                os.cromagem,
                os.montagem,
                os.teste,
                os.pintura
            ];

            const hasActiveStatus = osStatuses.some(status => activeStatuses.includes(status));
            return hasActiveStatus;
        });

        this.renderTable();
    }

    renderTable() {
        const tbody = document.getElementById('os-tbody');
        tbody.innerHTML = '';

        if (this.filteredData.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="11" style="text-align: center; padding: 40px; color: #64748b; font-style: italic;">
                        Nenhuma OS encontrada com os filtros aplicados
                    </td>
                </tr>
            `;
            return;
        }

        this.filteredData.forEach(os => {
            const row = document.createElement('tr');
            row.dataset.osNumber = os.nrOS;
            
            row.innerHTML = `
                <td><strong>${os.nrOS}</strong></td>
                <td>${os.cliente}</td>
                <td>${this.renderStatusCell(os.previsaoEntregaPec)}</td>
                <td>${os.previsaoEntregaItem}</td>
                <td>${this.renderStatusCell(os.usinagem)}</td>
                <td>${this.renderStatusCell(os.brunimento)}</td>
                <td>${this.renderStatusCell(os.cromagem)}</td>
                <td>${this.renderStatusCell(os.montagem)}</td>
                <td>${this.renderStatusCell(os.teste)}</td>
                <td>${this.renderStatusCell(os.pintura)}</td>
                <td>${os.responsavel}</td>
            `;

            tbody.appendChild(row);
        });
    }

    renderStatusCell(status) {
        const statusMap = {
            'finalizado': 'Finalizado',
            'programado': 'Programado',
            'aguardando': 'Aguardando',
            'nao-aplica': 'N/A'
        };

        return `
            <div class="status-cell">
                <span class="status-dot ${status}"></span>
                <span>${statusMap[status] || status}</span>
            </div>
        `;
    }

    selectOS(osNumber, rowElement) {
        // Remove seleção anterior
        document.querySelectorAll('tbody tr').forEach(row => {
            row.classList.remove('selected');
        });

        // Adiciona seleção à nova linha
        rowElement.classList.add('selected');
        this.selectedOS = osNumber;

        // Renderiza detalhes
        this.renderDetails(osNumber);
    }

    renderDetails(osNumber) {
        const detailsBody = document.getElementById('details-tbody');
        const details = osDetailsData[osNumber];

        if (!details || details.length === 0) {
            detailsBody.innerHTML = `
                <tr>
                    <td colspan="13" class="no-selection">
                        Nenhum detalhe encontrado para a OS ${osNumber}
                    </td>
                </tr>
            `;
            return;
        }

        detailsBody.innerHTML = '';
        
        details.forEach(detail => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${detail.atividade}</td>
                <td><strong>${detail.status}</strong></td>
                <td>${detail.macrogrupo}</td>
                <td>${detail.item}</td>
                <td>${detail.codPlaq}</td>
                <td>${detail.partname}</td>
                <td>${detail.decisao}</td>
                <td>${detail.justific}</td>
                <td>${detail.codProdu}</td>
                <td>${detail.planejado}</td>
                <td>${detail.operador}</td>
                <td>${detail.dtHoraInicial}</td>
                <td>${detail.dtHoraFinal}</td>
            `;
            detailsBody.appendChild(row);
        });
    }

    // Método para adicionar nova OS (para futuras expansões)
    addOS(osData) {
        osData.push(osData);
        this.applyFilters();
    }

    // Método para atualizar status de uma OS
    updateOSStatus(osNumber, field, newStatus) {
        const os = osData.find(item => item.nrOS === osNumber);
        if (os && os[field] !== undefined) {
            os[field] = newStatus;
            this.applyFilters();
            
            // Se esta OS está selecionada, atualiza os detalhes
            if (this.selectedOS === osNumber) {
                this.renderDetails(osNumber);
            }
        }
    }
}

// Inicializar o dashboard quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new DashboardOS();
});

// Funções utilitárias para expansões futuras
window.DashboardUtils = {
    // Formatar data
    formatDate: (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    },

    // Exportar dados para CSV
    exportToCSV: () => {
        const data = window.dashboard.filteredData;
        const headers = ['NR OS', 'CLIENTE', 'Previsão Entrega Peç', 'Previsão Entrega Item', 'Usinagem', 'Brunimento', 'Cromagem', 'Montagem', 'Teste', 'Pintura', 'Responsável'];
        
        let csv = headers.join(',') + '\n';
        data.forEach(os => {
            const row = [
                os.nrOS,
                os.cliente,
                os.previsaoEntregaPec,
                os.previsaoEntregaItem,
                os.usinagem,
                os.brunimento,
                os.cromagem,
                os.montagem,
                os.teste,
                os.pintura,
                os.responsavel
            ];
            csv += row.join(',') + '\n';
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'os_data.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    },

    // Adicionar notificação
    showNotification: (message, type = 'info') => {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
};