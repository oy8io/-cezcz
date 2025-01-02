// تحديث الساعة والتاريخ
function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    // تحويل إلى نظام 12 ساعة
    const period = hours >= 12 ? 'مساءً' : 'صباحاً';
    hours = hours % 12 || 12;
    
    // تحديث الساعة الرقمية
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    hoursElement.textContent = hours.toString().padStart(2, '0');
    minutesElement.textContent = minutes.toString().padStart(2, '0');
    secondsElement.textContent = seconds.toString().padStart(2, '0');
    
    // إضافة تأثير اللون الأحمر للثواني في آخر 10 ثواني
    if (seconds >= 50) {
        secondsElement.classList.add('color-change-seconds');
        
        // عند الوصول للثانية 59
        if (seconds === 59) {
            // إزالة تأثير الثواني
            setTimeout(() => {
                secondsElement.classList.remove('color-change-seconds');
                // إضافة تأثير الدقائق الأخضر
                minutesElement.classList.add('color-change-minutes');
                // إزالة تأثير الدقائق بعد ثلاث ثواني
                setTimeout(() => {
                    minutesElement.classList.remove('color-change-minutes');
                }, 3000);
            }, 1000);
        }
    } else {
        secondsElement.classList.remove('color-change-seconds');
    }
    
    // تحديث التحية مع الأيقونات
    updateGreeting();
    
    // تحديث باقي العناصر
    updatePrayerProgress(now);
    updateBackground(now);
}

// تحديث التحية والأيقونة حسب الوقت
function updateGreeting() {
    const now = new Date();
    const hour = now.getHours();
    const greetingText = document.querySelector('.greeting-text');
    const greetingIcon = document.querySelector('.greeting-icon');

    if (hour >= 5 && hour < 12) {
        greetingText.textContent = 'صباح الخير';
        greetingIcon.textContent = '☀️';
    } else if (hour >= 12 && hour < 15) {
        greetingText.textContent = 'ظهر سعيد';
        greetingIcon.textContent = '🌤️';
    } else if (hour >= 15 && hour < 18) {
        greetingText.textContent = 'عصر سعيد';
        greetingIcon.textContent = '🌅';
    } else if (hour >= 18 && hour < 22) {
        greetingText.textContent = 'مساء الخير';
        greetingIcon.textContent = '🌙';
    } else {
        greetingText.textContent = 'ليلة سعيدة';
        greetingIcon.textContent = '🌙';
    }
}

// تحديث الخلفية حسب الوقت
function updateBackground() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const day = now.getDay();
    const time = hours * 60 + minutes;
    
    let gradientType;
    let showStars = false;

    // تحديد نوع الخلفية حسب الوقت
    if (time >= 300 && time < 390) { // 5:00 - 6:30
        gradientType = `--fajr-gradient-${(day % 3) + 1}`;
        showStars = true;
    } 
    else if (time >= 390 && time < 480) { // 6:30 - 8:00
        gradientType = `--sunrise-gradient-${(day % 3) + 1}`;
    }
    else if (time >= 480 && time < 660) { // 8:00 - 11:00
        gradientType = `--morning-gradient-${(day % 3) + 1}`;
    }
    else if (time >= 660 && time < 900) { // 11:00 - 15:00
        gradientType = `--noon-gradient-${(day % 3) + 1}`;
    }
    else if (time >= 900 && time < 1050) { // 15:00 - 17:30
        gradientType = `--asr-gradient-${(day % 3) + 1}`;
    }
    else if (time >= 1050 && time < 1140) { // 17:30 - 19:00
        gradientType = `--maghrib-gradient-${(day % 3) + 1}`;
        showStars = time >= 1080; // بعد 18:00
    }
    else { // 19:00 - 5:00
        gradientType = `--night-gradient-${(day % 3) + 1}`;
        showStars = true;
    }

    // تطبيق الخلفية بتأثير انتقالي
    document.body.style.background = `var(${gradientType})`;
    
    // إظهار/إخفاء النجوم
    const starsElement = document.querySelector('.stars-container');
    if (starsElement) {
        starsElement.style.opacity = showStars ? '1' : '0';
    }
}

// دالة إنشاء النجوم
function createStars() {
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars-container';
    document.body.appendChild(starsContainer);

    // تقليل عدد النجوم من 200 إلى 100
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // تحديد حجم النجمة عشوائياً
        const size = Math.random();
        if (size < 0.6) {
            star.classList.add('small');
        } else if (size < 0.9) {
            star.classList.add('medium');
        } else {
            star.classList.add('large');
        }

        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        // زيادة مدة التأخير لتقليل الحركة المتزامنة
        star.style.animationDelay = `${Math.random() * 5}s`;
        
        starsContainer.appendChild(star);
    }
}

// تشغيل التحديثات
window.onload = () => {
    createStars();
    updateClock();
    updateDate();
    setInterval(updateClock, 1000);
};

// دالة للحصول على وقت الصلاة السابقة
function getPreviousPrayerTime(nextPrayer) {
    const prayers = Array.from(document.querySelectorAll('.prayer-time'));
    const nextIndex = prayers.indexOf(nextPrayer);
    if (nextIndex > 0) {
        const prevPrayer = prayers[nextIndex - 1];
        const [hours, minutes] = prevPrayer.dataset.time.split(':').map(Number);
        return hours * 60 + minutes;
    }
    // إذا كانت الصلاة القادمة هي الفجر، نرجع وقت العشاء من اليوم السابق
    const [ishaHours, ishaMinutes] = prayerTimes.isha.split(':').map(Number);
    return (ishaHours * 60 + ishaMinutes) - (24 * 60);
}

// تحديث تنبيه الصلاة
function updatePrayerAlert(nextPrayer) {
    const alertElement = document.getElementById('prayer-alert');
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [nextHours, nextMinutes] = nextPrayer.dataset.time.split(':').map(Number);
    const nextPrayerTime = nextHours * 60 + nextMinutes;
    const timeUntilPrayer = nextPrayerTime - currentTime;

    if (timeUntilPrayer <= 10 && timeUntilPrayer > 0) {
        const prayerName = nextPrayer.querySelector('.prayer-name').textContent;
        document.getElementById('next-prayer').textContent = prayerName;
        alertElement.classList.add('show');
        document.querySelector('.progress').classList.add('warning');
    } else {
        alertElement.classList.remove('show');
        document.querySelector('.progress').classList.remove('warning');
    }
}

// تحديث شريط تقدم الصلوات
function updatePrayerProgress(now) {
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const prayers = document.querySelectorAll('.prayer-time');
    let nextPrayer = null;
    
    prayers.forEach(prayer => {
        const [hours, minutes] = prayer.dataset.time.split(':').map(Number);
        const prayerTime = hours * 60 + minutes;
        prayer.classList.remove('passed', 'next');
        
        if (currentTime >= prayerTime) {
            prayer.classList.add('passed');
        } else if (!nextPrayer) {
            nextPrayer = prayer;
            prayer.classList.add('next');
        }
    });
    
    if (nextPrayer) {
        const [nextHours, nextMinutes] = nextPrayer.dataset.time.split(':').map(Number);
        const nextPrayerTime = nextHours * 60 + nextMinutes;
        const progress = ((currentTime - getPreviousPrayerTime(nextPrayer)) / 
                        (nextPrayerTime - getPreviousPrayerTime(nextPrayer))) * 100;
        
        const progressBar = document.querySelector('.progress');
        progressBar.style.width = `${progress}%`;
        updatePrayerAlert(nextPrayer);
    }
}

// تحديث التاريخ
function updateDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const arabicDate = now.toLocaleDateString('ar-SA', options);
    
    document.getElementById('hijri-date').textContent = arabicDate;
    document.getElementById('gregorian-date').textContent = now.toLocaleDateString('ar-EG', options);
}

// إضافة أوقات الصلاة
const prayerTimes = {
    fajr: '5:15',
    sunrise: '6:33',
    dhuhr: '12:27',
    asr: '3:49',
    maghrib: '6:21',
    isha: '7:35'
}; 

// تحديث التحية كل دقيقة
setInterval(updateGreeting, 60000);
// تحديث التحية عند تحميل الصفحة
updateGreeting(); 

// تحديث الخلفية كل 30 ثانية
setInterval(updateBackground, 30000);
// تحديث الخلفية عند تحميل الصفحة
updateBackground(); 

// استدعاء الدالة عند تحميل الصفحة
window.addEventListener('load', createStars); 