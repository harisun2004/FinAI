document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // Agent data
    const agents = [
        { id: 'querier', name: 'Database Querier', avatar: '/placeholder.svg?height=40&width=40', specialty: 'Data Retrieval' },
        { id: 'mailer', name: 'Email Composer', avatar: '/placeholder.svg?height=40&width=40', specialty: 'Email Communication' },
        { id: 'month-end-close', name: 'Month End Close Agent', avatar: '/placeholder.svg?height=40&width=40', specialty: 'Financial Closing' },
    ];

    let selectedAgent = agents[2]; // Start with Month End Close Agent
    let chats = {
        'month-end-close': { id: '1', title: 'Month End Close', messages: [] },
        'querier': { id: '2', title: 'Database Queries', messages: [] },
        'mailer': { id: '3', title: 'Email Composition', messages: [] },
    };
    let currentChat = chats['month-end-close'];
    let progressSteps = [
        { step: 1, description: "Reconciliation", status: "completed" },
        { step: 2, description: "Email Drafting", status: "in-progress" },
        { step: 3, description: "User Consent", status: "pending" },
        { step: 4, description: "Email Responses", status: "pending" },
        { step: 5, description: "Journal Entries", status: "pending" },
        { step: 6, description: "Excel Review", status: "pending" },
    ];
    let emailsSent = 0;
    let emailResponses = 0;

    // Populate agent buttons
    const agentButtonsContainer = document.getElementById('agentButtons');
    agents.forEach(agent => {
        const button = document.createElement('button');
        button.className = `btn btn-outline ${agent.id === selectedAgent.id ? 'active' : ''}`;
        button.innerHTML = `
            <img src="${agent.avatar}" alt="${agent.name}" class="avatar">
            <span>${agent.name}</span>
        `;
        button.addEventListener('click', () => selectAgent(agent));
        agentButtonsContainer.appendChild(button);
    });

    // Populate chat history
    function updateChatHistory() {
        const chatHistory = document.getElementById('chatHistory');
        chatHistory.innerHTML = '';
        Object.values(chats).forEach(chat => {
            const button = document.createElement('button');
            button.className = `btn btn-outline ${chat.id === currentChat.id ? 'active' : ''}`;
            button.innerHTML = `<i data-lucide="message-square"></i>${chat.title}`;
            button.addEventListener('click', () => selectChat(chat));
            chatHistory.appendChild(button);
        });
        lucide.createIcons();
    }

    updateChatHistory();

    // Handle agent selection
    function selectAgent(agent) {
        selectedAgent = agent;
        currentChat = chats[agent.id];
        document.querySelectorAll('#agentButtons .btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`#agentButtons .btn:nth-child(${agents.indexOf(agent) + 1})`).classList.add('active');
        updateChatMessages();
        document.getElementById('monthEndCloseContent').style.display = agent.id === 'month-end-close' ? 'block' : 'none';
        document.getElementById('otherAgentContent').style.display = agent.id !== 'month-end-close' ? 'block' : 'none';
    }

    // Handle chat selection
    function selectChat(chat) {
        currentChat = chat;
        updateChatMessages();
        document.querySelectorAll('#chatHistory .btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`#chatHistory .btn:nth-child(${Object.values(chats).indexOf(chat) + 1})`).classList.add('active');
    }

    // Update chat messages
    function updateChatMessages() {
        const chatMessages = document.getElementById(selectedAgent.id === 'month-end-close' ? 'chatMessages' : 'agentChatMessages');
        chatMessages.innerHTML = '';
        currentChat.messages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.className = `message ${message.sender}`;
            messageElement.innerHTML = `
                <div class="message-avatar">${message.sender === 'user' ? 'U' : 'A'}</div>
                <div class="message-content">
                    <p>${message.content}</p>
                </div>
            `;
            chatMessages.appendChild(messageElement);
        });
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Handle sending messages
    function sendMessage(input, sendButton) {
        const content = input.value.trim();
        if (content) {
            const newMessage = {
                id: Date.now().toString(),
                content: content,
                sender: 'user'
            };
            currentChat.messages.push(newMessage);
            updateChatMessages();
            input.value = '';

            // Simulate AI response
            sendButton.disabled = true;
            sendButton.innerHTML = '<i data-lucide="loader"></i>Thinking...';
            lucide.createIcons();

            setTimeout(() => {
                let aiMessage;
                if (selectedAgent.id === 'month-end-close') {
                    aiMessage = {
                        id: (Date.now() + 1).toString(),
                        content: "Here's the current progress of the month-end close process:",
                        sender: 'agent'
                    };
                    updateProgress();
                } else if (selectedAgent.id === 'querier') {
                    aiMessage = {
                        id: (Date.now() + 1).toString(),
                        content: "Here's the result of your database query: [Table data would be displayed here]",
                        sender: 'agent'
                    };
                } else if (selectedAgent.id === 'mailer') {
                    aiMessage = {
                        id: (Date.now() + 1).toString(),
                        content: "I've drafted the following email for your review: [Email content would be displayed here]",
                        sender: 'agent'
                    };
                    emailsSent++;
                    document.getElementById('emailsSent').textContent = emailsSent;
                }
                currentChat.messages.push(aiMessage);
                updateChatMessages();
                sendButton.disabled = false;
                sendButton.innerHTML = '<i data-lucide="send"></i>Send';
                lucide.createIcons();
            }, 1500);
        }
    }

    document.getElementById('sendButton').addEventListener('click', () => sendMessage(document.getElementById('messageInput'), document.getElementById('sendButton')));
    document.getElementById('agentSendButton').addEventListener('click', () => sendMessage(document.getElementById('agentMessageInput'), document.getElementById('agentSendButton')));

    // Handle tab switching
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            button.classList.add('active');
            document.getElementById(`${tabName}Tab`).classList.add('active');
        });
    });

    // Handle new chat creation
    document.getElementById('newChatBtn').addEventListener('click', () => {
        const newChatId = Date.now().toString();
        const newChat = {
            id: newChatId,
            title: `New Chat ${Object.keys(chats).length + 1}`,
            messages: []
        };
        chats[newChatId] = newChat;
        currentChat = newChat;
        updateChatHistory();
        updateChatMessages();
    });

    // Update progress
    function updateProgress() {
        const completedSteps = progressSteps.filter(step => step.status === 'completed').length;
        const totalSteps = progressSteps.length;
        const progressPercentage = (completedSteps / totalSteps) * 100;

        document.getElementById('overallProgress').style.width = `${progressPercentage}%`;
        document.getElementById('completedSteps').textContent = completedSteps;
        document.getElementById('totalSteps').textContent = totalSteps;
        document.getElementById('emailsSent').textContent = emailsSent;
        document.getElementById('emailResponses').textContent = emailResponses;

        const progressStepsContainer = document.getElementById('progressSteps');
        progressStepsContainer.innerHTML = '';
        progressSteps.forEach((step, index) => {
            const stepElement = document.createElement('div');
            stepElement.className = 'progress-step';
            stepElement.innerHTML = `
                <div class="step-icon ${step.status === 'completed' ? 'bg-green-500' : step.status === 'in-progress' ? 'bg-yellow-500' : 'bg-red-500'}">
                    ${step.status === 'completed' ? '✓' : step.status === 'in-progress' ? '◯' : '◯'}
                </div>
                <div>
                    <p>Step ${step.step}: ${step.description}</p>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${step.status === 'completed' ? '100%' : step.status === 'in-progress' ? '50%' : '0%'}"></div>
                    </div>
                </div>
            `;
            progressStepsContainer.appendChild(stepElement);
        });

        const progressCards = document.getElementById('progressCards');
        progressCards.innerHTML = '';
        progressSteps.forEach(step => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>Step ${step.step}: ${step.description}</h3>
                <div class="progress-bar">
                    <div class="progress" style="width: ${step.status === 'completed' ? '100%' : step.status === 'in-progress' ? '50%' : '0%'}"></div>
                </div>
                <p>${step.status === 'completed' ? 'Completed' : step.status === 'in-progress' ? 'In Progress' : 'Pending'}</p>
                ${step.status !== 'completed' ? `
                    <button class="btn btn-primary" onclick="updateStepStatus(${step.step})">
                        ${step.status === 'pending' ? 'Start' : 'Complete'}
                    </button>
                ` : ''}
                ${step.step === 6 && step.status === 'completed' ? `
                    <button class="btn btn-primary" onclick="downloadExcel()">
                        <i data-lucide="file-spreadsheet"></i>
                        Download Excel
                    </button>
                ` : ''}
            `;
            progressCards.appendChild(card);
        });
        lucide.createIcons();
    }

    updateProgress();

    // Update step status
    window.updateStepStatus = function(stepNumber) {
        const step = progressSteps.find(s => s.step === stepNumber);
        if (step.status === 'pending') {
            step.status = 'in-progress';
        } else if (step.status === 'in-progress') {
            step.status = 'completed';
        }
        updateProgress();
    };

    // Download Excel
    window.downloadExcel = function() {
        console.log("Downloading Excel file...");
        // Implement actual Excel download logic here
    };

    // Toggle sidebar
    document.getElementById('sidebarToggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('active');
    });

    // Initial setup
    selectAgent(selectedAgent);
});

console.log("This script would typically run in a browser environment. Here's a simulation of its execution:");
console.log("- Initialized Lucide icons");
console.log("- Set up agent data and chat history");
console.log("- Created agent selection buttons");
console.log("- Set up event listeners for chat interactions");
console.log("- Initialized progress tracking for month-end close process");
console.log("- Set up tab switching functionality");
console.log("- Prepared new chat creation functionality");
console.log("- Set up progress update and step status change functions");
console.log("- Added sidebar toggle functionality for mobile view");
console.log("- Selected initial agent (Month End Close Agent)");
