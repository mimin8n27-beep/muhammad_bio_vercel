import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "ar" | "en";

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
  dir: "rtl" | "ltr";
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem("lang") as Language) || "ar";
  });

  const setLang = (l: Language) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  };

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: string): string => {
    const val = translations[lang]?.[key];
    return val ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir: lang === "ar" ? "rtl" : "ltr" }}>
      {children}
    </LanguageContext.Provider>
  );
}

// ─────────────────────────────────────────────
// TRANSLATIONS
// ─────────────────────────────────────────────
const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Header
    "nav.home": "الرئيسية",
    "nav.portfolio": "معرض الأعمال",
    "nav.pricing": "خطط التسعير",
    "nav.contact": "تواصل معي",

    // Hero
    "hero.badge": "متخصص في أتمتة الأعمال الرقمية",
    "hero.title": "أنا Muhammad",
    "hero.desc": "أبني أنظمة Automation رقمية متكاملة للشركات الصغيرة والمتوسطة باستخدام تقنيات حديثة، لخفض التكاليف وزيادة الكفاءة التشغيلية إلى أقصى حد ممكن.",
    "hero.cta.contact": "تواصل معي",
    "hero.cta.start": "ابدأ مشروعك الآن",
    "hero.stat.automations": "عملية Automation",
    "hero.stat.clients": "عميل راضٍ",
    "hero.stat.uptime": "عمل تلقائي",

    // Expertise
    "expertise.title": "خبرتي العملية",
    "expertise.desc": "أركز على تحليل عميق وتصميم معماريات متقدمة لبناء أنظمة Automation فعالة وقابلة للتوسع",
    "expertise.1.title": "تحليل سير العمل",
    "expertise.1.desc": "فهم دقيق للمنطق التشغيلي الحالي وتحديد نقاط التحسين",
    "expertise.2.title": "تصميم المعمارية",
    "expertise.2.desc": "بناء هياكل قابلة للتوسع ومصممة خصيصاً لاحتياجاتك",
    "expertise.3.title": "أنظمة متقدمة",
    "expertise.3.desc": "حلول ذكية تعمل 24/7 مع تحكم كامل في البيانات والقرارات",

    // Tools
    "tools.title": "أدواتي الأساسية",
    "tools.n8n.desc": "منصة قوية للـ Automation",
    "tools.zapier.desc": "ربط التطبيقات",
    "tools.make.desc": "Automation مرنة",

    // Portfolio
    "portfolio.title": "معرض الأعمال",
    "portfolio.desc": "مشاريع حقيقية نفذتها باستخدام تقنيات الـ Automation الحديثة",
    "portfolio.empty": "سيتم إضافة المشاريع قريباً",
    "portfolio.noImage": "لا توجد صورة",
    "portfolio.author": "المؤلف",
    "portfolio.toolsUsed": "الأدوات المستخدمة",
    "portfolio.viewProject": "عرض المشروع",

    // Solutions
    "solutions.title": "الحلول التي أقدمها",
    "solutions.1.title": "إدارة العملاء المحتملين",
    "solutions.1.desc": "من الاستحواذ الأولي وحتى إتمام الصفقة",
    "solutions.2.title": "Automation العمليات الداخلية",
    "solutions.2.desc": "تبسيط التنسيق بين الأقسام والفرق",
    "solutions.3.title": "دمج الذكاء الاصطناعي",
    "solutions.3.desc": "استخدام AI كمحرك لاتخاذ القرارات",
    "solutions.4.title": "Automation شاملة",
    "solutions.4.desc": "تقليل التدخل البشري والأخطاء المتكررة",

    // Niches
    "niches.title": "مجالات التخصص",
    "niches.desc": "أركز على مجالات محددة حيث أستطيع تقديم أفضل القيمة والنتائج",

    // Pricing
    "pricing.title": "أسعار بسيطة وشفافة",
    "pricing.desc": "اختر الباقة المناسبة لمشروعك. جميع الأسعار تشمل الدعم والتوثيق.",
    "pricing.basePrice": "السعر الأساسي",
    "pricing.premiumOptions": "الخيارات الإضافية",
    "pricing.finalPrice": "السعر النهائي",
    "pricing.popular": "⭐ الأكثر طلباً",
    "pricing.getStarted": "ابدأ الآن",
    "pricing.learnMore": "اعرف المزيد",
    "pricing.customDesc": "تحتاج حلاً مخصصاً؟ دعنا نناقش متطلباتك.",
    "pricing.viewFull": "عرض تفاصيل الأسعار الكاملة",

    // How I Work
    "howIWork.title": "كيف أعمل معك",
    "howIWork.desc": "نهج منظم واحترافي لبناء أنظمة Automation تعمل فعلاً.",
    "howIWork.step1.title": "الاستشارة الأولية",
    "howIWork.step1.desc": "أحلل مشكلتك قبل التفكير في الأدوات. أفهم عمليتك الحالية، وأحدد نقاط الألم، وأقرر ما إذا كانت الـ Automation هي الحل الصحيح.",
    "howIWork.step1.deliverable": "مقترح احترافي بجدول زمني واقعي",
    "howIWork.step1.duration": "1-2 أيام",
    "howIWork.step2.title": "الاكتشاف والتصميم",
    "howIWork.step2.desc": "أطرح أسئلة تفصيلية حول Workflow الخاص بك، ومصادر البيانات، والأنظمة، والنتائج المرجوة. ثم أنشئ مخططاً كاملاً للـ Automation.",
    "howIWork.step2.deliverable": "ملاحظات الاكتشاف + المخطط",
    "howIWork.step2.duration": "2-3 أيام",
    "howIWork.step3.title": "التنفيذ",
    "howIWork.step3.desc": "أبني الـ Workflow الفعلي مع المنطق الصحيح ومعالجة البيانات وإدارة الأخطاء. هنا يتحول المخطط إلى نظام حقيقي.",
    "howIWork.step3.deliverable": "نظام Automation يعمل",
    "howIWork.step3.duration": "حسب التعقيد",
    "howIWork.step4.title": "الاختبار والتحسين",
    "howIWork.step4.desc": "أختبر كل مكوّن ونقاط التكامل والحالات الحدية. أضمن أن النظام مستقر وموثوق ويتعامل مع المواقف غير المتوقعة.",
    "howIWork.step4.deliverable": "نظام مستقر ومختبر",
    "howIWork.step4.duration": "2-3 أيام",
    "howIWork.step5.title": "التسليم المتميز",
    "howIWork.step5.desc": "تحصل على الحزمة الكاملة: النظام العامل، والتوثيق PDF، وجلسة تدريب (30-60 دقيقة)، وفيديو شرح.",
    "howIWork.step5.deliverable": "النظام + التوثيق + التدريب + الفيديو",
    "howIWork.step5.duration": "1-2 أيام",
    "howIWork.step6.title": "الدعم بعد التسليم",
    "howIWork.step6.desc": "أقدم دعماً قصير المدى (7-14 يوم) لإصلاح أي مشاكل. وأحدد أيضاً فرصاً لتحسينات إضافية.",
    "howIWork.step6.deliverable": "دعم مستمر وتحسين",
    "howIWork.step6.duration": "7-14 يوم",
    "howIWork.why.title": "لماذا هذا النهج يعمل",
    "howIWork.why.1.title": "احترافي ومنظم",
    "howIWork.why.1.desc": "كل مشروع يتبع نظاماً مجرباً",
    "howIWork.why.2.title": "يقلل الأخطاء",
    "howIWork.why.2.desc": "الاختبار الشامل يكشف المشاكل مبكراً",
    "howIWork.why.3.title": "يزيد القيمة",
    "howIWork.why.3.desc": "توثيق وتدريب كاملان مشمولان",
    "howIWork.why.4.title": "نجاح طويل المدى",
    "howIWork.why.4.desc": "الدعم بعد التسليم يضمن الاستدامة",
    "howIWork.deliverable": "التسليم",
    "howIWork.duration": "المدة",

    // FAQ
    "faq.title": "الأسئلة الشائعة",
    "faq.desc": "كل ما تحتاج معرفته عن العمل معي في مشاريع الـ Automation.",
    "faq.q1": "كيف تحدد إذا كان مشروعي يحتاج Automation؟",
    "faq.a1": "خلال الاستشارة الأولية، أحلل عمليتك الحالية وأحدد نقاط الألم وأقيّم ما إذا كانت الـ Automation ستحل مشكلتك فعلاً. ليس كل عملية تحتاج Automation—أحياناً أداة بسيطة أفضل. أكون صريحاً في ما سينجح وما لن ينجح.",
    "faq.q2": "ماذا لو كان مشروعي أكثر تعقيداً مما توقعنا؟",
    "faq.a2": "لو توسع نطاق مشروعك أثناء التطوير، سأناقشك قبل المتابعة. أقدم تقديرات واقعية بناءً على مرحلة الاكتشاف، وإذا اكتشفنا متطلبات جديدة، سنضبط الجدول الزمني والتكلفة معاً—بلا مفاجآت.",
    "faq.q3": "هل يمكنني الترقية بعد البدء؟",
    "faq.a3": "بالتأكيد. لو بدأت بباقة Small واكتشفت أنك تحتاج ميزات أكثر، يمكننا الترقية إلى Medium أو Large. التكلفة الإضافية ستحسب بشكل عادل بناءً على العمل الإضافي المطلوب.",
    "faq.q4": "ما الأدوات التي تستخدمها في الـ Automation؟",
    "faq.a4": "أستخدم بشكل أساسي n8n وZapier وMake. الاختيار يعتمد على احتياجاتك وميزانيتك والمتطلبات التقنية. n8n قوي وفعّال التكلفة لـ Workflow المعقدة، بينما Zapier ممتاز للتكاملات البسيطة.",
    "faq.q5": "هل تقدم خطط دفع؟",
    "faq.a5": "نعم، يمكنني العمل معك على ترتيبات دفع مرنة. للمشاريع الكبيرة، يمكننا مناقشة مدفوعات على مراحل. دعنا نناقش ما يناسب ميزانيتك.",
    "faq.q6": "هل سأفهم كيف يعمل النظام؟",
    "faq.a6": "بالتأكيد. كجزء من التسليم، أقدم توثيقاً شاملاً وجلسة تدريبية وفيديو شرح. أشرح كل شيء بطريقة مفهومة لك.",
    "faq.q7": "كم يستغرق المشروع النموذجي؟",
    "faq.a7": "يعتمد على التعقيد. المشاريع الصغيرة 4-8 ساعات، المتوسطة 8-15 ساعة، والكبيرة 15-30+ ساعة. هذا يشمل الاكتشاف والتصميم والتنفيذ والاختبار والتسليم.",
    "faq.q8": "هل يمكنك التكامل مع أدواتي الحالية؟",
    "faq.a8": "على الأرجح نعم. أعمل مع CRM وEmail Platforms وGoogle Sheets وNotion وSlack والمئات من الأدوات الأخرى. إذا كانت أداتك لها API أو تكامل مع Zapier، يمكنني الاتصال بها.",
    "faq.q9": "ماذا لو احتجت دعماً مستمراً بعد المشروع؟",
    "faq.a9": "أقدم باقات دعم مستمر للصيانة والتحديثات وإضافة ميزات جديدة. مع نمو عملك وتطور احتياجات الـ Automation، يمكنني مساعدتك في التوسع.",
    "faq.cta": "لا تزال لديك أسئلة؟ دعنا نتحدث!",
    "faq.cta.btn": "تواصل معي",

    // Contact
    "contact.title": "تواصل معي الآن",
    "contact.desc": "هل لديك مشروع في الذهن؟ أو تريد معرفة المزيد عن خدماتي؟ تواصل معي عبر النموذج أدناه أو الطرق السريعة.",
    "contact.name": "اسمك الكامل",
    "contact.namePlaceholder": "محمد أحمد",
    "contact.email": "بريدك الإلكتروني",
    "contact.company": "اسم شركتك",
    "contact.companyPlaceholder": "اسم الشركة (اختياري)",
    "contact.message": "رسالتك",
    "contact.messagePlaceholder": "أخبرني عن احتياجاتك والعمليات التي تريد أتمتتها...",
    "contact.send": "إرسال الرسالة",
    "contact.sending": "جاري الإرسال...",
    "contact.success.title": "شكراً لك!",
    "contact.success.desc": "تم استقبال رسالتك بنجاح. سأتواصل معك قريباً.",
    "contact.error": "حدث خطأ أثناء الإرسال، حاول مرة أخرى.",
    "contact.quickTitle": "طرق التواصل السريعة",
    "contact.emailLabel": "البريد الإلكتروني",

    // Footer
    "footer.desc": "أبني أنظمة Automation تُوسّع عملك وتُقلل من العمل اليدوي.",
    "footer.links": "روابط سريعة",
    "footer.getInTouch": "تواصل معنا",
    "footer.home": "الرئيسية",
    "footer.pricing": "الأسعار",
    "footer.contact": "تواصل",
    "footer.rights": "© 2026 Muhammad. جميع الحقوق محفوظة.",
    "footer.subtitle": "Automation Systems Architect | حلول قابلة للتوسع للشركات الصغيرة والمتوسطة",

    // Portfolio Page
    "portfolioPage.title": "معرض الأعمال",
    "portfolioPage.desc": "مشاريع حقيقية نفذتها باستخدام تقنيات الـ Automation الحديثة",
    "portfolioPage.empty": "لا توجد مشاريع حتى الآن",
    "portfolioPage.contact": "تواصل لمناقشة مشروعك",
    "portfolioPage.back": "العودة للرئيسية",
    "portfolioPage.close": "إغلاق",
    "portfolioPage.workflow": "عرض الـ Workflow",
    "portfolioPage.fullscreen": "ملء الشاشة",

    // Pricing Page
    "pricingPage.title": "الأسعار",
    "pricingPage.desc": "باقات واضحة وشفافة لكل مشروع",
    "pricingPage.name": "اسمك",
    "pricingPage.namePlaceholder": "أدخل اسمك",
    "pricingPage.email": "بريدك الإلكتروني",
    "pricingPage.message": "تفاصيل مشروعك",
    "pricingPage.messagePlaceholder": "أخبرني عن مشروعك...",
    "pricingPage.send": "إرسال",
    "pricingPage.sending": "جاري الإرسال...",
    "pricingPage.success": "تم إرسال طلبك! سأتواصل معك قريباً.",
    "pricingPage.error": "حدث خطأ، حاول مرة أخرى.",
    "pricingPage.faq.title": "الأسئلة الشائعة",
    "pricingPage.contact.title": "هل تحتاج عرضاً مخصصاً؟",
    "pricingPage.contact.desc": "تواصل معي وسأرد في أقرب وقت.",
    "pricingPage.contact.whatsapp": "WhatsApp",
    "pricingPage.contact.email": "البريد الإلكتروني",
    "pricingPage.basePrice": "السعر الأساسي",
    "pricingPage.premiumOptions": "الخيارات الإضافية",
    "pricingPage.finalPrice": "السعر النهائي",
    "pricingPage.popular": "⭐ الأكثر طلباً",
    "pricingPage.getStarted": "ابدأ الآن",
    "pricingPage.learnMore": "اعرف المزيد",
  },

  en: {
    // Header
    "nav.home": "Home",
    "nav.portfolio": "Portfolio",
    "nav.pricing": "Pricing",
    "nav.contact": "Contact",

    // Hero
    "hero.badge": "Business Automation Specialist",
    "hero.title": "I'm Muhammad",
    "hero.desc": "I build integrated digital automation systems for small and medium businesses using modern technologies, reducing costs and maximizing operational efficiency.",
    "hero.cta.contact": "Contact Me",
    "hero.cta.start": "Start Your Project",
    "hero.stat.automations": "Automations Built",
    "hero.stat.clients": "Happy Clients",
    "hero.stat.uptime": "Automated Work",

    // Expertise
    "expertise.title": "My Expertise",
    "expertise.desc": "I focus on deep analysis and advanced architecture design to build effective, scalable automation systems",
    "expertise.1.title": "Workflow Analysis",
    "expertise.1.desc": "Precise understanding of current operational logic and identifying improvement points",
    "expertise.2.title": "Architecture Design",
    "expertise.2.desc": "Building scalable structures designed specifically for your needs",
    "expertise.3.title": "Advanced Systems",
    "expertise.3.desc": "Smart solutions running 24/7 with full control over data and decisions",

    // Tools
    "tools.title": "My Core Tools",
    "tools.n8n.desc": "Powerful automation platform",
    "tools.zapier.desc": "App connectivity",
    "tools.make.desc": "Flexible automation",

    // Portfolio
    "portfolio.title": "Portfolio",
    "portfolio.desc": "Real projects built using modern automation technologies",
    "portfolio.empty": "Projects coming soon",
    "portfolio.noImage": "No image",
    "portfolio.author": "Author",
    "portfolio.toolsUsed": "Tools Used",
    "portfolio.viewProject": "View Project",

    // Solutions
    "solutions.title": "Solutions I Provide",
    "solutions.1.title": "Lead Management",
    "solutions.1.desc": "From initial acquisition to closing the deal",
    "solutions.2.title": "Internal Process Automation",
    "solutions.2.desc": "Streamlining coordination between departments and teams",
    "solutions.3.title": "AI Integration",
    "solutions.3.desc": "Using AI as a decision-making engine",
    "solutions.4.title": "End-to-End Automation",
    "solutions.4.desc": "Reducing manual intervention and repetitive errors",

    // Niches
    "niches.title": "Areas of Specialization",
    "niches.desc": "I focus on specific domains where I can deliver the best value and results",

    // Pricing
    "pricing.title": "Simple & Transparent Pricing",
    "pricing.desc": "Choose the right automation package for your project. All prices include support and documentation.",
    "pricing.basePrice": "Base Price",
    "pricing.premiumOptions": "Premium Options",
    "pricing.finalPrice": "Final Price",
    "pricing.popular": "⭐ Most Popular",
    "pricing.getStarted": "Get Started",
    "pricing.learnMore": "Learn More",
    "pricing.customDesc": "Need a custom solution? Let's discuss your specific requirements.",
    "pricing.viewFull": "View Full Pricing Details",

    // How I Work
    "howIWork.title": "How I Work With You",
    "howIWork.desc": "A structured, professional approach to building automation systems that actually work.",
    "howIWork.step1.title": "Initial Consultation",
    "howIWork.step1.desc": "I analyze your problem before thinking about tools. I understand your current process, identify pain points, and determine if automation is the right solution.",
    "howIWork.step1.deliverable": "Professional proposal with realistic timeline",
    "howIWork.step1.duration": "1–2 days",
    "howIWork.step2.title": "Discovery & Design",
    "howIWork.step2.desc": "I ask detailed questions about your workflows, data sources, systems, and desired outcomes. Then I create a complete automation blueprint.",
    "howIWork.step2.deliverable": "Automation Discovery Notes + Blueprint",
    "howIWork.step2.duration": "2–3 days",
    "howIWork.step3.title": "Implementation",
    "howIWork.step3.desc": "I build the actual workflow with proper logic, data processing, error handling, and logging. This is where the blueprint becomes a working system.",
    "howIWork.step3.deliverable": "Working automation system",
    "howIWork.step3.duration": "Depends on complexity",
    "howIWork.step4.title": "Testing & Optimization",
    "howIWork.step4.desc": "I test every component, integration points, edge cases, and stress scenarios. I ensure the system is stable, reliable, and handles unexpected situations gracefully.",
    "howIWork.step4.deliverable": "Stable, tested system",
    "howIWork.step4.duration": "2–3 days",
    "howIWork.step5.title": "Premium Delivery",
    "howIWork.step5.desc": "You get the complete package: the working system, comprehensive PDF documentation, a training session (30–60 min), and a video walkthrough.",
    "howIWork.step5.deliverable": "System + Docs + Training + Video",
    "howIWork.step5.duration": "1–2 days",
    "howIWork.step6.title": "Post-Delivery Support",
    "howIWork.step6.desc": "I provide short-term support (7–14 days) to fix any issues and identify opportunities for additional automations.",
    "howIWork.step6.deliverable": "Ongoing support & optimization",
    "howIWork.step6.duration": "7–14 days",
    "howIWork.why.title": "Why This Approach Works",
    "howIWork.why.1.title": "Professional & Structured",
    "howIWork.why.1.desc": "Every project follows a proven system",
    "howIWork.why.2.title": "Reduces Errors",
    "howIWork.why.2.desc": "Thorough testing catches issues early",
    "howIWork.why.3.title": "Increases Value",
    "howIWork.why.3.desc": "Complete documentation & training included",
    "howIWork.why.4.title": "Long-term Success",
    "howIWork.why.4.desc": "Post-delivery support ensures sustainability",
    "howIWork.deliverable": "Deliverable",
    "howIWork.duration": "Duration",

    // FAQ
    "faq.title": "Frequently Asked Questions",
    "faq.desc": "Everything you need to know about working with me on automation projects.",
    "faq.q1": "How do you determine if my project needs automation?",
    "faq.a1": "During the initial consultation, I analyze your current process, identify pain points, and assess whether automation will actually solve your problem. Not every process needs automation—sometimes a simple tool or workflow change is better. I'm honest about what will and won't work.",
    "faq.q2": "What if my project is more complex than expected?",
    "faq.a2": "If your project scope expands during development, I'll discuss it with you before proceeding. I provide realistic estimates based on the discovery phase, but if we discover new requirements, we'll adjust the timeline and cost together—no surprises.",
    "faq.q3": "Can I upgrade my plan after starting?",
    "faq.a3": "Absolutely. If you start with a Small plan and later realize you need more features, we can upgrade to Medium or Large. The additional cost will be calculated fairly based on the extra work required.",
    "faq.q4": "What tools do you use for automation?",
    "faq.a4": "I primarily use n8n, Zapier, and Make. The choice depends on your specific needs, budget, and technical requirements. n8n is powerful and cost-effective for complex workflows, while Zapier is great for simple integrations.",
    "faq.q5": "Do you offer payment plans?",
    "faq.a5": "Yes, I can work with you on flexible payment arrangements. For larger projects, we can discuss milestone-based payments or payment plans.",
    "faq.q6": "Will I understand how the system works?",
    "faq.a6": "Absolutely. As part of the delivery, I provide comprehensive documentation, a training session, and a video walkthrough. I explain everything in a way that makes sense to you.",
    "faq.q7": "How long does a typical project take?",
    "faq.a7": "It depends on complexity. Small projects take 4–8 hours, Medium 8–15 hours, and Large 15–30+ hours. This includes discovery, design, implementation, testing, and delivery.",
    "faq.q8": "Can you integrate with my existing tools?",
    "faq.a8": "Most likely, yes. I work with CRMs, email platforms, Google Sheets, Notion, Slack, and hundreds of other tools. If your tool has an API or Zapier integration, I can connect it.",
    "faq.q9": "What if I need ongoing support after the initial project?",
    "faq.a9": "I offer ongoing support packages for maintenance, updates, and new feature additions. As your business grows, I can help you scale the system.",
    "faq.cta": "Still have questions? Let's talk!",
    "faq.cta.btn": "Get in Touch",

    // Contact
    "contact.title": "Contact Me Now",
    "contact.desc": "Have a project in mind? Or want to learn more about my services? Contact me via the form below or through quick channels.",
    "contact.name": "Full Name",
    "contact.namePlaceholder": "John Doe",
    "contact.email": "Email Address",
    "contact.company": "Company Name",
    "contact.companyPlaceholder": "Company name (optional)",
    "contact.message": "Your Message",
    "contact.messagePlaceholder": "Tell me about your needs and the processes you want to automate...",
    "contact.send": "Send Message",
    "contact.sending": "Sending...",
    "contact.success.title": "Thank you!",
    "contact.success.desc": "Your message has been received. I'll get back to you soon.",
    "contact.error": "An error occurred. Please try again.",
    "contact.quickTitle": "Quick Contact Methods",
    "contact.emailLabel": "Email",

    // Footer
    "footer.desc": "Building automation systems that scale your business and reduce manual work.",
    "footer.links": "Quick Links",
    "footer.getInTouch": "Get in Touch",
    "footer.home": "Home",
    "footer.pricing": "Pricing",
    "footer.contact": "Contact",
    "footer.rights": "© 2026 Muhammad. All rights reserved.",
    "footer.subtitle": "Automation Systems Architect | Building scalable solutions for SMBs",

    // Portfolio Page
    "portfolioPage.title": "Portfolio",
    "portfolioPage.desc": "Real projects built using modern automation technologies",
    "portfolioPage.empty": "No projects yet",
    "portfolioPage.contact": "Contact to discuss your project",
    "portfolioPage.back": "Back to Home",
    "portfolioPage.close": "Close",
    "portfolioPage.workflow": "View Workflow",
    "portfolioPage.fullscreen": "Fullscreen",

    // Pricing Page
    "pricingPage.title": "Pricing",
    "pricingPage.desc": "Clear and transparent packages for every project",
    "pricingPage.name": "Your Name",
    "pricingPage.namePlaceholder": "Enter your name",
    "pricingPage.email": "Email Address",
    "pricingPage.message": "Project Details",
    "pricingPage.messagePlaceholder": "Tell me about your project...",
    "pricingPage.send": "Send",
    "pricingPage.sending": "Sending...",
    "pricingPage.success": "Request sent! I'll get back to you soon.",
    "pricingPage.error": "An error occurred. Please try again.",
    "pricingPage.faq.title": "FAQ",
    "pricingPage.contact.title": "Need a Custom Quote?",
    "pricingPage.contact.desc": "Contact me and I'll respond as soon as possible.",
    "pricingPage.contact.whatsapp": "WhatsApp",
    "pricingPage.contact.email": "Email",
    "pricingPage.basePrice": "Base Price",
    "pricingPage.premiumOptions": "Premium Options",
    "pricingPage.finalPrice": "Final Price",
    "pricingPage.popular": "⭐ Most Popular",
    "pricingPage.getStarted": "Get Started",
    "pricingPage.learnMore": "Learn More",
  },
};
