// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Login section is already displayed by default via CSS
    
    // Check for remembered login
    checkRememberedLogin();
    
    // Login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Add event listeners for all logout buttons
    document.getElementById('admin-logout').addEventListener('click', handleLogout);
    document.getElementById('member-logout').addEventListener('click', handleLogout);
    document.getElementById('user-logout').addEventListener('click', handleLogout);
    
    // Add event listeners for sidebar navigation
    const sidebarItems = document.querySelectorAll('.sidebar li');
    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            activateTab(this, tabName);
        });
    });
    
    // Add event listeners for member management
    const addMemberBtn = document.getElementById('add-member-btn');
    if (addMemberBtn) {
        addMemberBtn.addEventListener('click', showAddMemberModal);
    }
    
    // Close modal when clicking on X
    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.style.display = 'none';
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Member form submission
    const memberForm = document.getElementById('member-form');
    if (memberForm) {
        memberForm.addEventListener('submit', handleMemberFormSubmit);
    }
    
    // Search functionality for members
    const memberSearch = document.getElementById('member-search');
    if (memberSearch) {
        memberSearch.addEventListener('input', filterMembers);
    }
    
    // Search functionality for user's member search
    const userMemberSearch = document.getElementById('user-member-search');
    if (userMemberSearch) {
        const searchBtn = document.getElementById('search-btn');
        searchBtn.addEventListener('click', function() {
            searchMembers(userMemberSearch.value);
        });
    }
    
    // Forgot password link
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            showForgotPasswordModal();
        });
    }
    
    // Google sign in button
    const googleSignInBtn = document.querySelector('.btn-google');
    if (googleSignInBtn) {
        googleSignInBtn.addEventListener('click', function() {
            handleGoogleSignIn();
        });
    }
    
    // Register link
    const registerLink = document.querySelector('.register-link a');
    if (registerLink) {
        registerLink.addEventListener('click', function(e) {
            e.preventDefault();
            showRegistrationModal();
        });
    }
    
    // Workout day tabs
    const workoutDayTabs = document.querySelectorAll('.workout-day');
    if (workoutDayTabs.length > 0) {
        workoutDayTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all workout day tabs
                workoutDayTabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Get the day to show
                const day = this.getAttribute('data-day');
                
                // Hide all day plans
                const dayPlans = document.querySelectorAll('.day-plan');
                dayPlans.forEach(plan => plan.classList.remove('active'));
                
                // Show the selected day plan
                const selectedPlan = document.getElementById(`${day}-workout`);
                if (selectedPlan) {
                    selectedPlan.classList.add('active');
                } else {
                    // If the plan doesn't exist yet, create a placeholder
                    createPlaceholderWorkout(day);
                }
            });
        });
    }
    
    // Meal tabs
    const mealTabs = document.querySelectorAll('.meal-tab');
    if (mealTabs.length > 0) {
        mealTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all meal tabs
                mealTabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Get the meal to show
                const meal = this.getAttribute('data-meal');
                
                // Hide all meal items
                const mealItems = document.querySelectorAll('.meal-items');
                mealItems.forEach(item => item.classList.remove('active'));
                
                // Show the selected meal items
                const selectedItems = document.getElementById(`${meal}-meal`);
                if (selectedItems) {
                    selectedItems.classList.add('active');
                } else {
                    // If the meal items don't exist yet, create a placeholder
                    createPlaceholderMeal(meal);
                }
            });
        });
    }
    
    // Animation for the nutrition progress bars on load
    setTimeout(() => {
        const progressBars = document.querySelectorAll('.progress');
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = width;
            }, 300);
        });
    }, 1000);
    
    // Load mock data for demonstration
    loadMockData();
});

// Check for remembered login
function checkRememberedLogin() {
    const rememberedEmail = localStorage.getItem('gym_remembered_email');
    const rememberedUserType = localStorage.getItem('gym_remembered_user_type');
    
    if (rememberedEmail) {
        document.getElementById('email').value = rememberedEmail;
        if (rememberedUserType) {
            document.getElementById('user-type').value = rememberedUserType;
        }
        document.getElementById('remember-me').checked = true;
    }
}

// Login handler
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const userType = document.getElementById('user-type').value;
    const rememberMe = document.getElementById('remember-me').checked;
    const loginError = document.getElementById('login-error');
    
    // Simple validation
    if (!email || !password) {
        loginError.textContent = 'Email and password are required';
        loginError.style.display = 'block';
        shakeForm();
        return;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        loginError.textContent = 'Please enter a valid email address';
        loginError.style.display = 'block';
        shakeForm();
        return;
    }
    
    // For demonstration, we'll accept any credentials that pass validation
    // In a real application, you would verify with Firebase Authentication
    
    // Show loading state
    const loginBtn = document.querySelector('#login-form button[type="submit"]');
    const originalBtnText = loginBtn.innerHTML;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
    loginBtn.disabled = true;
    
    // Simulate network request
    setTimeout(() => {
        loginBtn.innerHTML = originalBtnText;
        loginBtn.disabled = false;
        
        // If remember me is checked, store in localStorage (for demo)
        if (rememberMe) {
            localStorage.setItem('gym_remembered_email', email);
            localStorage.setItem('gym_remembered_user_type', userType);
        } else {
            localStorage.removeItem('gym_remembered_email');
            localStorage.removeItem('gym_remembered_user_type');
        }
        
        loginError.style.display = 'none';
        showDashboard(userType);
    }, 1500);
}

// Function to shake the form on validation error
function shakeForm() {
    const form = document.getElementById('login-form');
    form.classList.add('shake');
    setTimeout(() => {
        form.classList.remove('shake');
    }, 500);
}

// Handle Google Sign In
function handleGoogleSignIn() {
    const loginError = document.getElementById('login-error');
    loginError.textContent = '';
    
    // Show loading state
    const googleBtn = document.querySelector('.btn-google');
    const originalBtnText = googleBtn.innerHTML;
    googleBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
    googleBtn.disabled = true;
    
    // Simulate Google authentication
    setTimeout(() => {
        googleBtn.innerHTML = originalBtnText;
        googleBtn.disabled = false;
        
        // For demo, we'll just log in as a member
        showDashboard('member');
    }, 2000);
}

// Show registration modal
function showRegistrationModal() {
    alert('Registration functionality would be implemented here.\nFor this demo, please use the login form with any credentials.');
}

// Show forgot password modal
function showForgotPasswordModal() {
    alert('Password reset functionality would be implemented here.\nFor this demo, please use any password to login.');
}

// Logout handler
function handleLogout() {
    // Hide all dashboard sections
    const dashboardSections = document.querySelectorAll('.dashboard-section');
    dashboardSections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Show login screen
    document.getElementById('login-section').style.display = 'block';
    
    // Clear login form
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    document.getElementById('login-error').textContent = '';
}

// Show appropriate dashboard based on user type
function showDashboard(userType) {
    // Hide login section
    document.getElementById('login-section').style.display = 'none';
    
    // Hide all dashboard sections first
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show appropriate dashboard
    switch (userType) {
        case 'admin':
            document.getElementById('admin-section').style.display = 'block';
            break;
        case 'member':
            document.getElementById('member-section').style.display = 'block';
            populateMemberProfile();
            break;
        case 'user':
            document.getElementById('user-section').style.display = 'block';
            break;
        default:
            document.getElementById('login-section').style.display = 'block';
    }
}

// Activate tab in dashboards
function activateTab(clickedItem, tabName) {
    // Remove active class from all items in the same sidebar
    const sidebarItems = clickedItem.parentElement.querySelectorAll('li');
    sidebarItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to clicked item
    clickedItem.classList.add('active');
    
    // Hide all tab content in the same dashboard
    const dashboard = clickedItem.closest('.dashboard-section');
    const tabContents = dashboard.querySelectorAll('.tab-content');
    tabContents.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab content
    const tabToShow = dashboard.querySelector(`#${tabName}-tab`);
    if (tabToShow) {
        tabToShow.classList.add('active');
    }
}

// Show add member modal
function showAddMemberModal() {
    const modal = document.getElementById('member-modal');
    const modalTitle = document.getElementById('modal-title');
    const form = document.getElementById('member-form');
    
    // Clear form
    form.reset();
    
    // Set modal title
    modalTitle.textContent = 'Add New Member';
    
    // Show modal
    modal.style.display = 'block';
}

// Handle member form submission
function handleMemberFormSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('member-name').value;
    const email = document.getElementById('member-email').value;
    const phone = document.getElementById('member-phone').value;
    const address = document.getElementById('member-address').value;
    const membershipType = document.getElementById('membership-type').value;
    
    // In a real application, you would save to Firebase here
    const memberId = 'MEM' + Math.floor(Math.random() * 1000);
    const newMember = {
        id: memberId,
        name: name,
        email: email,
        phone: phone,
        address: address,
        membership: membershipType,
        status: 'Active'
    };
    
    // Add to mock data
    mockMembers.push(newMember);
    
    // Update table
    populateMembersTable();
    
    // Close modal
    document.getElementById('member-modal').style.display = 'none';
}

// Filter members based on search input
function filterMembers() {
    const searchText = document.getElementById('member-search').value.toLowerCase();
    const filteredMembers = mockMembers.filter(member => 
        member.name.toLowerCase().includes(searchText) || 
        member.email.toLowerCase().includes(searchText) ||
        member.id.toLowerCase().includes(searchText)
    );
    
    populateMembersTable(filteredMembers);
}

// Search members (for user module)
function searchMembers(searchText) {
    searchText = searchText.toLowerCase();
    const filteredMembers = mockMembers.filter(member => 
        member.name.toLowerCase().includes(searchText) || 
        member.email.toLowerCase().includes(searchText) ||
        member.id.toLowerCase().includes(searchText)
    );
    
    populateUserMembersTable(filteredMembers);
}

// Show member details (for user module)
function showMemberDetails(memberId) {
    const member = mockMembers.find(m => m.id === memberId);
    if (member) {
        // Activate member details tab
        const sidebarItems = document.querySelectorAll('#user-section .sidebar li');
        sidebarItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-tab') === 'member-details') {
                item.classList.add('active');
            }
        });
        
        // Show member details tab
        const tabContents = document.querySelectorAll('#user-section .tab-content');
        tabContents.forEach(tab => {
            tab.classList.remove('active');
        });
        document.getElementById('member-details-tab').classList.add('active');
        
        // Populate member details
        const detailsContainer = document.getElementById('member-details-container');
        detailsContainer.innerHTML = `
            <div class="member-card">
                <h4>${member.name}</h4>
                <p><strong>ID:</strong> ${member.id}</p>
                <p><strong>Email:</strong> ${member.email}</p>
                <p><strong>Phone:</strong> ${member.phone}</p>
                <p><strong>Membership Type:</strong> ${member.membership}</p>
                <p><strong>Status:</strong> ${member.status}</p>
                <p><strong>Address:</strong> ${member.address || 'Not provided'}</p>
            </div>
        `;
    }
}

// Populate members table
function populateMembersTable(members = mockMembers) {
    const tableBody = document.querySelector('#members-table tbody');
    if (tableBody) {
        tableBody.innerHTML = '';
        
        members.forEach(member => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${member.id}</td>
                <td>${member.name}</td>
                <td>${member.email}</td>
                <td>${member.phone}</td>
                <td>${member.membership}</td>
                <td><span class="status-badge ${member.status.toLowerCase()}">${member.status}</span></td>
                <td>
                    <button class="btn btn-primary btn-sm edit-member" data-id="${member.id}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-member" data-id="${member.id}">Delete</button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Add event listeners to edit and delete buttons
        document.querySelectorAll('.edit-member').forEach(button => {
            button.addEventListener('click', function() {
                editMember(this.getAttribute('data-id'));
            });
        });
        
        document.querySelectorAll('.delete-member').forEach(button => {
            button.addEventListener('click', function() {
                deleteMember(this.getAttribute('data-id'));
            });
        });
    }
}

// Populate user's members table
function populateUserMembersTable(members = mockMembers) {
    const tableBody = document.querySelector('#user-members-table tbody');
    if (tableBody) {
        tableBody.innerHTML = '';
        
        members.forEach(member => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${member.id}</td>
                <td>${member.name}</td>
                <td>${member.email}</td>
                <td>${member.phone}</td>
                <td>${member.membership}</td>
                <td>
                    <button class="btn btn-primary btn-sm view-member" data-id="${member.id}">View Details</button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Add event listeners to view buttons
        document.querySelectorAll('.view-member').forEach(button => {
            button.addEventListener('click', function() {
                showMemberDetails(this.getAttribute('data-id'));
            });
        });
    }
}

// Edit member
function editMember(memberId) {
    const member = mockMembers.find(m => m.id === memberId);
    if (member) {
        const modal = document.getElementById('member-modal');
        const modalTitle = document.getElementById('modal-title');
        
        // Set form values
        document.getElementById('member-name').value = member.name;
        document.getElementById('member-email').value = member.email;
        document.getElementById('member-phone').value = member.phone;
        document.getElementById('member-address').value = member.address || '';
        document.getElementById('membership-type').value = member.membership;
        
        // Add member ID to form for update
        const form = document.getElementById('member-form');
        form.dataset.memberId = memberId;
        
        // Set modal title
        modalTitle.textContent = 'Edit Member';
        
        // Show modal
        modal.style.display = 'block';
        
        // Update submit handler
        form.onsubmit = function(e) {
            e.preventDefault();
            
            // Update member in mock data
            const index = mockMembers.findIndex(m => m.id === memberId);
            if (index !== -1) {
                mockMembers[index].name = document.getElementById('member-name').value;
                mockMembers[index].email = document.getElementById('member-email').value;
                mockMembers[index].phone = document.getElementById('member-phone').value;
                mockMembers[index].address = document.getElementById('member-address').value;
                mockMembers[index].membership = document.getElementById('membership-type').value;
                
                // Update table
                populateMembersTable();
                
                // Close modal
                modal.style.display = 'none';
                
                // Reset form handler
                form.onsubmit = handleMemberFormSubmit;
            }
        };
    }
}

// Delete member
function deleteMember(memberId) {
    if (confirm('Are you sure you want to delete this member?')) {
        // Remove from mock data
        const index = mockMembers.findIndex(m => m.id === memberId);
        if (index !== -1) {
            mockMembers.splice(index, 1);
            
            // Update table
            populateMembersTable();
        }
    }
}

// Populate member profile (for member module)
function populateMemberProfile() {
    // For demonstration, we'll use the first mock member
    const member = mockMembers[0];
    
    // Populate profile info
    const profileInfo = document.querySelector('#member-section .profile-info');
    if (profileInfo) {
        profileInfo.innerHTML = `
            <div class="profile-header">
                <div class="profile-avatar">
                    <i class="fas fa-user-circle fa-5x"></i>
                </div>
                <div class="profile-details">
                    <h4>${member.name}</h4>
                    <p>${member.email}</p>
                    <p>Membership: ${member.membership}</p>
                    <p>Status: ${member.status}</p>
                </div>
            </div>
            <div class="profile-body mt-20">
                <div class="form-group">
                    <label>Phone Number</label>
                    <p>${member.phone}</p>
                </div>
                <div class="form-group">
                    <label>Address</label>
                    <p>${member.address || 'Not provided'}</p>
                </div>
                <div class="form-group">
                    <label>Join Date</label>
                    <p>January 1, 2023</p>
                </div>
                <button class="btn btn-primary">Edit Profile</button>
            </div>
        `;
    }
    
    // Populate payment history
    const paymentTableBody = document.querySelector('#payment-table tbody');
    if (paymentTableBody) {
        paymentTableBody.innerHTML = '';
        
        mockPayments.forEach(payment => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${payment.id}</td>
                <td>${payment.date}</td>
                <td>₹${payment.amount}</td>
                <td><span class="status-badge ${payment.status.toLowerCase()}">${payment.status}</span></td>
                <td><button class="btn btn-secondary btn-sm view-receipt" data-id="${payment.id}">View Receipt</button></td>
            `;
            
            paymentTableBody.appendChild(row);
        });
    }
    
    // Populate notifications
    const notificationsList = document.querySelector('.notifications-list');
    if (notificationsList) {
        notificationsList.innerHTML = '';
        
        mockNotifications.forEach(notification => {
            const item = document.createElement('div');
            item.className = 'notification-item';
            
            item.innerHTML = `
                <div class="notification-content">
                    <h5>${notification.title}</h5>
                    <p>${notification.message}</p>
                </div>
                <div class="notification-date">
                    <span class="date">${notification.date}</span>
                </div>
            `;
            
            notificationsList.appendChild(item);
        });
    }
}

// Mock data for demonstration
let mockMembers = [];
let mockPayments = [];
let mockNotifications = [];

// Load mock data
function loadMockData() {
    // Mock members with Indian names
    mockMembers = [
        {
            id: 'MEM001',
            name: 'Rahul Sharma',
            email: 'rahul@example.com',
            phone: '9876543210',
            address: '123 MG Road, Mumbai, India',
            membership: 'premium',
            status: 'Active'
        },
        {
            id: 'MEM002',
            name: 'Priya Patel',
            email: 'priya@example.com',
            phone: '8765432109',
            address: '456 Gandhi Nagar, Delhi, India',
            membership: 'basic',
            status: 'Active'
        },
        {
            id: 'MEM003',
            name: 'Amit Kumar',
            email: 'amit@example.com',
            phone: '7654321098',
            address: '789 Jubilee Hills, Hyderabad, India',
            membership: 'platinum',
            status: 'Inactive'
        }
    ];
    
    // Mock payments in Rupees
    mockPayments = [
        {
            id: 'REC001',
            date: '2023-01-01',
            amount: '3749',
            status: 'Paid',
            memberId: 'MEM001'
        },
        {
            id: 'REC002',
            date: '2023-02-01',
            amount: '3749',
            status: 'Paid',
            memberId: 'MEM001'
        },
        {
            id: 'REC003',
            date: '2023-03-01',
            amount: '3749',
            status: 'Pending',
            memberId: 'MEM001'
        }
    ];
    
    // Mock notifications
    mockNotifications = [
        {
            id: 'NOT001',
            title: 'Monthly Fee Due',
            message: 'Your monthly fee of ₹3,749 is due on March 1, 2023.',
            date: '2023-02-25',
            memberId: 'MEM001'
        },
        {
            id: 'NOT002',
            title: 'Gym Holiday Hours',
            message: 'The gym will have special hours during the upcoming holiday. Please check our website for details.',
            date: '2023-02-20',
            memberId: 'MEM001'
        }
    ];
    
    // Populate tables with mock data
    populateMembersTable();
    
    // Load billing data for admin
    const billingTableBody = document.querySelector('#billing-table tbody');
    if (billingTableBody) {
        billingTableBody.innerHTML = '';
        
        mockPayments.forEach(payment => {
            const member = mockMembers.find(m => m.id === payment.memberId);
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${payment.id}</td>
                <td>${member ? member.name : 'Unknown'}</td>
                <td>₹${payment.amount}</td>
                <td>${payment.date}</td>
                <td><span class="status-badge ${payment.status.toLowerCase()}">${payment.status}</span></td>
                <td>
                    <button class="btn btn-secondary btn-sm view-bill" data-id="${payment.id}">View</button>
                    <button class="btn btn-primary btn-sm send-reminder" data-id="${payment.id}">Send Reminder</button>
                </td>
            `;
            
            billingTableBody.appendChild(row);
        });
    }
}

// Create placeholder workout for days that don't have content yet
function createPlaceholderWorkout(day) {
    const workoutContent = document.querySelector('.workout-content');
    const dayPlan = document.createElement('div');
    dayPlan.id = `${day}-workout`;
    dayPlan.className = 'day-plan active';
    
    let workoutTitle, exercises;
    
    // Set workout details based on the day
    switch(day) {
        case 'tuesday':
            workoutTitle = 'Yoga & Flexibility';
            exercises = [
                { title: 'Surya Namaskar', sets: '8 cycles', desc: 'Complete sequence of 12 yoga poses done in a flowing manner, synchronized with breathing.' },
                { title: 'Warrior Pose Series', sets: '3 sets x 30 seconds each', desc: 'Virabhadrasana I, II, and III performed in sequence, focusing on balance and strength.' },
                { title: 'Meditation', sets: '10 minutes', desc: 'Seated meditation focusing on breathing and mindfulness.' }
            ];
            break;
        case 'wednesday':
            workoutTitle = 'Rest & Recovery';
            exercises = [
                { title: 'Pranayama', sets: '15 minutes', desc: 'Breathing exercises including Anulom Vilom (alternate nostril breathing) and Kapalbhati.' },
                { title: 'Light Walking', sets: '20 minutes', desc: 'Easy-paced walking to promote blood circulation and recovery.' }
            ];
            break;
        case 'thursday':
            workoutTitle = 'Strength & Conditioning';
            exercises = [
                { title: 'Squats', sets: '4 sets x 10 reps', desc: 'Traditional squats with proper form, maintaining back straight and knees behind toes.' },
                { title: 'Dand-Baithak (Indian Push-ups & Squats)', sets: '3 sets x 15 reps', desc: 'Traditional Indian exercise combining push-ups with squats in a flowing movement.' },
                { title: 'Plank Hold', sets: '3 sets x 60 seconds', desc: 'Hold a plank position with proper form, engaging core muscles.' }
            ];
            break;
        default:
            workoutTitle = 'Holistic Fitness';
            exercises = [
                { title: 'Surya Namaskar', sets: '5 cycles', desc: 'Sun salutation sequence to warm up the body and increase flexibility.' },
                { title: 'Core Strengthening', sets: '3 sets x 12 reps', desc: 'Series of abdominal exercises focusing on building core strength.' }
            ];
    }
    
    dayPlan.innerHTML = `
        <h4>${workoutTitle}</h4>
        <div class="exercise-list">
            ${exercises.map(exercise => `
                <div class="exercise-item">
                    <div class="exercise-header">
                        <div class="exercise-title">${exercise.title}</div>
                        <div class="exercise-sets">${exercise.sets}</div>
                    </div>
                    <div class="exercise-desc">
                        <p>${exercise.desc}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    workoutContent.appendChild(dayPlan);
}

// Create placeholder meal for tabs that don't have content yet
function createPlaceholderMeal(mealType) {
    const mealContent = document.querySelector('.meal-content');
    const mealItems = document.createElement('div');
    mealItems.id = `${mealType}-meal`;
    mealItems.className = 'meal-items active';
    
    let mealDetails;
    
    // Set meal details based on the type with Indian dishes
    switch(mealType) {
        case 'lunch':
            mealDetails = [
                {
                    icon: 'fa-utensils',
                    title: 'Paneer Tikka Salad',
                    desc: '150g grilled paneer, mixed greens, cucumber, tomatoes, mint chutney dressing',
                    macros: ['380 cal', '22g protein', '12g carbs', '24g fat']
                },
                {
                    icon: 'fa-apple-alt',
                    title: 'Fresh Fruit',
                    desc: '1 medium apple or seasonal fruit',
                    macros: ['95 cal', '0g protein', '25g carbs', '0g fat']
                }
            ];
            break;
        case 'dinner':
            mealDetails = [
                {
                    icon: 'fa-utensils',
                    title: 'Tandoori Chicken with Brown Rice',
                    desc: '180g tandoori chicken, 1 cup brown rice, steamed vegetables',
                    macros: ['520 cal', '40g protein', '45g carbs', '18g fat']
                },
                {
                    icon: 'fa-glass',
                    title: 'Buttermilk',
                    desc: '1 glass buttermilk (chaas)',
                    macros: ['80 cal', '8g protein', '12g carbs', '1g fat']
                }
            ];
            break;
        case 'snacks':
            mealDetails = [
                {
                    icon: 'fa-seedling',
                    title: 'Roasted Chana',
                    desc: '1/4 cup roasted chana (chickpeas)',
                    macros: ['120 cal', '7g protein', '15g carbs', '3g fat']
                },
                {
                    icon: 'fa-mug-hot',
                    title: 'Masala Chai with Jaggery',
                    desc: '1 cup masala chai with 1 tsp jaggery',
                    macros: ['70 cal', '2g protein', '15g carbs', '1g fat']
                }
            ];
            break;
        default:
            mealDetails = [
                {
                    icon: 'fa-utensils',
                    title: 'Oats Idli with Sambar',
                    desc: '2 oats idli with vegetable sambar',
                    macros: ['240 cal', '12g protein', '35g carbs', '6g fat']
                },
                {
                    icon: 'fa-mug-hot',
                    title: 'Green Tea',
                    desc: '1 cup green tea',
                    macros: ['2 cal', '0g protein', '0g carbs', '0g fat']
                }
            ];
    }
    
    mealItems.innerHTML = mealDetails.map(meal => `
        <div class="meal-item">
            <div class="meal-image">
                <i class="fas ${meal.icon || 'fa-utensils'}"></i>
            </div>
            <div class="meal-details">
                <h5>${meal.title}</h5>
                <p>${meal.desc}</p>
                <div class="meal-macros">
                    ${meal.macros.map(macro => `<span>${macro}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
    
    mealContent.appendChild(mealItems);
} 