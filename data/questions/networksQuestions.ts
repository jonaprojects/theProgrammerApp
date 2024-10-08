import type { Questions } from "./models";

const networksQuestions: Questions = [
  {
    id: 0,
    question: "מה הפרוטוקול העיקרי שמשמש לשליחה של דפי אינטרנט ברשת?",
    type: "multiple",
    correctAnswer: "HTTP",
    incorrectAnswers: ["ARP", "DNS", "HTML"],
  },
  {
    id: 1,
    question: "מה התפקיד של פרוטוקול DNS?",
    type: "multiple",
    correctAnswer: "מקבל כתובת URL באנגלית ומחזיר את כתובת ה-IP המתאימה לה",
    incorrectAnswers: [
      "מקבל כתובת IP ומחזיר כתובת MAC מתאימה לה",
      "שמירה של דפי אינטרנט באופן לוקאלי בלקוח",
      "שליחה של אימיילים בין מכשירים",
    ],
  },
  {
    id: 2,
    question: "איך קוראים למודל שמתאר את תהליך התקשורת בין רכיבים שונים?",
    type: "multiple",
    correctAnswer: "מודל 5 השכבות",
    incorrectAnswers: [
      "מודל התקשורת האוניברסלי",
      "מודל שכבות הבצל",
      "backpropagation",
    ],
  },
  {
    id: 3,
    question:
      "איך קוראים לשכבה הנמוכה ביותר במודל השכבות, אשר אחראית על מעבר המידע כרצף של סיביות דרך תווך?",
    type: "multiple",
    correctAnswer: "השכבה הפיזית",
    incorrectAnswers: ["השכבה הבסיסית", "שכבת התווך", "שכבת הבסיס"],
  },
  {
    id: 4,
    question: "באופן כללי, מהם ההבדלים בין TCP לבין UDP?",
    type: "multiple",
    correctAnswer:
      "ב-TCP המידע מועבר באופן אמין יותר בעוד ש-UDP מאפשר מעבר מהיר יותר של מידע",
    incorrectAnswers: [
      "ב-TCP המידע מועבר באופן פחות אמין בעוד ש-UDP מאפשר מעבר מהיר יותר של מידע",
      "ב-UDP המידע מועבר באופן אמין יותר בעוד ש-TCP מאפשר מעבר מהיר יותר של מידע",
      "TCP הוא פרוטוקול חדש ובטוח יותר ולכן תמיד מומלץ להשתמש בו ולא ב-UDP",
    ],
  },
  {
    id: 5,
    question: "איזה פרוטוקול מאופיין בתהליך ״לחיצת היד המשולשת״?",
    type: "multiple",
    correctAnswer: "TCP",
    incorrectAnswers: ["UDP", "ARP", "SMTP"],
  },
  {
    id: 6,
    question: "באיזה פרוטוקול משתמשים על מנת לשלוח הודעות ping משורת הפקודה?",
    type: "multiple",
    correctAnswer: "ICMP",
    incorrectAnswers: ["IP", "UDP", "TCP"],
  },
  {
    id: 7,
    question: "כיצד נהוג לבצע שאילתות לדפי אינטרנט?",
    type: "multiple",
    correctAnswer: "בקשת GET",
    incorrectAnswers: ["בקשת POST", "בקשת PUT", "בקשת fetch"],
  },
  {
    id: 8,
    question: "מתי נוצר אתר האינטרנט הראשון בעולם",
    type: "multiple",
    correctAnswer: "1991",
    incorrectAnswers: ["1985", "1987", "1996"],
  },
  {
    id: 9,
    question: "איך קוראים לתהליך שבו שולפים מידע מאתרי אינטרנט קיימים ברשת?",
    type: "yesno",
    correctAnswer: true,
  },
  {
    id: 10,
    question:
      "איזה קוד שגיאה בפרוטוקול HTTP מצביע על כך שהמשאב שהתבקש אינו קיים?",
    type: "multiple",
    correctAnswer: "404",
    incorrectAnswers: ["403", "200", "305"],
  },
  {
    id: 11,
    question: "איזה קוד בפרוטוקול HTTP מסמל שהבקשה והתגובה התבצעו כראוי?",
    type: "multiple",
    correctAnswer: "200",
    incorrectAnswers: ["305", "404", "302"],
  },
  {
    id: 12,
    question: "לאיזו שכבה במודל 5 השכבות משויך מכשיר ה-switch?",
    type: "multiple",
    correctAnswer: "שכבת הקו (שכבה 2)",
    incorrectAnswers: [
      "שכבת הרשת (שכבה 3)",
      "שכבת התעבורה (שכבה 4)",
      "שכבת האפלקיציה (שכבה 5)",
    ],
  },
  {
    id: 13,
    question: "מה ההבדל העיקרי בפונקציונליות של Switch לעומת Hub?",
    type: "multiple",
    correctAnswer:
      "Switch מעביר את הפקטות המתאימות לכתובות MAC המתאימות ברשת, בעוד ש-hub משדר את ההודעות לכל המכשירים המחוברים אליו.",
    incorrectAnswers: [
      "Switch עובד בשכבת הרשת (שכבה 3) בעוד ש-Hub עובד בשכבת הקו (שכבה 2)",
      "Hub עובד בשכבת הרשת (שכבה 3) בעוד ש-Switch עובד בשכבת הקו (שכבה 2)",
      "Switch מחבר בין רשתות שונות בעוד ש-Hub משמש לחיבור בין מכשירים באותה הרשת באמצעות כבלי \nאת׳רנט (Ethernet).",
    ],
  },
  {
    id: 14,
    question: "לאיזו שכבה במודל 5 השכבות משויכות כתובות MAC?",
    type: "multiple",
    correctAnswer: "שכבת הקו (שכבה 2)",
    incorrectAnswers: [
      "שכבת הרשת (שכבה 3)",
      "שכבת התעבורה (שכבה 4)",
      "שכבת האפלקיציה (שכבה 5)",
    ],
  },
  {
    id: 15,
    question: "לאיזו שכבה במודל 5 השכבות משויכות כתובות IP?",
    type: "multiple",
    correctAnswer: "שכבת הרשת (שכבה 3)",
    incorrectAnswers: [
      "שכבת הקו (שכבה 2)",
      "שכבת התעבורה (שכבה 4)",
      "שכבת האפלקיציה (שכבה 5)",
    ],
  },
  {
    id: 16,
    question: "באיזה פורט (port) פועל בדרך כלל פרוטוקול HTTP?",
    type: "multiple",
    correctAnswer: "80",
    incorrectAnswers: ["70", "50", "400"],
  },
  {
    id: 17,
    question: "באיזה פורט (port) פועל בדרך כלל פרוטוקול ?HTTPS",
    type: "multiple",
    correctAnswer: "443",
    incorrectAnswers: ["70", "128", "336"],
  },
  {
    id: 18,
    question: "מה ההבדל העיקרי בין HTTP לבין HTTPS?",
    type: "multiple",
    correctAnswer:
      "מידע שעובר ב-HTTPS מוצפן באמצעות SSL/TLS ותעודות (certificates) דיגיטליות.",
    incorrectAnswers: [
      "HTTPS מאפשרת שליחה של קבצי וידאו בין שרתים במהירות רבה יותר באמצעות שימוש בשירותי CDN",
      "HTTPS היא גרסה מהירה ומשופרת יותר של HTTP ולכן חוסכת זמן ריצה בביצוע בקשות בדפי אינטרנט.",
      "אין הבדל משמעותי, אלו שתי גרסאות מאוד דומות של אותו הפרוטוקול שפותחו על ידי חברות מתחרות.",
    ],
  },
  {
    id: 19,
    question: "מהו הפרוטוקול המשמש להמרת כתובות IP לשמות דומיין?",
    type: "multiple",
    correctAnswer: "DNS",
    incorrectAnswers: ["DHCP", "FTP", "SMTP"],
  },
  {
    id: 20,
    question: "איזה פרוטוקול משמש להעברת קבצים ברשת?",
    type: "multiple",
    correctAnswer: "FTP",
    incorrectAnswers: ["HTTP", "SMTP", "TCP"],
  },
  {
    id: 22,
    question: "מהו המונח המתאר את היכולת של רשת לטפל בתעבורה מוגברת?",
    type: "multiple",
    correctAnswer: "סקלביליות",
    incorrectAnswers: ["לטנטיות", "פס רוחב", "תפוקה"],
  },
  {
    id: 23,
    question: "איזה סוג של טופולוגיית רשת מחבר את כל ההתקנים לכבל מרכזי אחד?",
    type: "multiple",
    correctAnswer: "קו",
    incorrectAnswers: ["כוכב", "טבעת", "רשת"],
  },
  {
    id: 24,
    question: "מהו הפרוטוקול המשמש לשליחת דואר אלקטרוני?",
    type: "multiple",
    correctAnswer: "SMTP",
    incorrectAnswers: ["POP3", "IMAP", "HTTP"],
  },
  {
    id: 25,
    question: "איזה שכבה במודל OSI אחראית על הצפנת נתונים?",
    type: "multiple",
    correctAnswer: "שכבת היישום",
    incorrectAnswers: ["שכבת התעבורה", "שכבת הרשת", "שכבת הקו"],
  },
  {
    id: 26,
    question:
      "מהו המונח המתאר את הזמן שלוקח לחבילת מידע לעבור מנקודה לנקודה ברשת?",
    type: "multiple",
    correctAnswer: "לטנטיות",
    incorrectAnswers: ["תפוקה", "פס רוחב", "סקלביליות"],
  },
  {
    id: 27,
    question: "איזה פרוטוקול משמש להקצאה אוטומטית של כתובות IP?",
    type: "multiple",
    correctAnswer: "DHCP",
    incorrectAnswers: ["DNS", "NAT", "ARP"],
  },
  {
    id: 28,
    question: "מהו המונח המתאר את כמות המידע שניתן להעביר ברשת בפרק זמן נתון?",
    type: "multiple",
    correctAnswer: "פס רוחב",
    incorrectAnswers: ["לטנטיות", "תפוקה", "סקלביליות"],
  },
  {
    id: 29,
    question: "איזה פרוטוקול משמש להעברת דפי אינטרנט?",
    type: "multiple",
    correctAnswer: "HTTP",
    incorrectAnswers: ["FTP", "SMTP", "DNS"],
  },
  {
    id: 30,
    question: "מהו המונח המתאר את ההגנה על מידע מפני גישה לא מורשית?",
    type: "multiple",
    correctAnswer: "אבטחת מידע",
    incorrectAnswers: ["הצפנה", "firewall", "NAT"],
  },
  {
    id: 30,
    question: "איזה פרוטוקול משמש לגישה מאובטחת מרחוק למחשבים?",
    type: "multiple",
    correctAnswer: "SSH",
    incorrectAnswers: ["FTP", "Telnet", "RDP"],
  },
  {
    id: 31,
    question: "מהו המונח המתאר את החיבור של רשתות שונות יחד?",
    type: "multiple",
    correctAnswer: "אינטרנטוורקינג",
    incorrectAnswers: ["רוטינג", "סוויצ'ינג", "ברידג'ינג"],
  },
  {
    id: 32,
    question: "איזה סוג של כתובת MAC מיועדת לשליחת מידע לכל המחשבים ברשת?",
    type: "multiple",
    correctAnswer: "Broadcast",
    incorrectAnswers: ["Unicast", "Multicast", "Anycast"],
  },
  {
    id: 33,
    question: "מהו הפרוטוקול המשמש להעברת קול על גבי רשת IP?",
    type: "multiple",
    correctAnswer: "VoIP",
    incorrectAnswers: ["SIP", "RTP", "RTSP"],
  },
  {
    id: 34,
    question: "איזה מנגנון משמש להסתרת כתובות IP פנימיות מהאינטרנט?",
    type: "multiple",
    correctAnswer: "NAT",
    incorrectAnswers: ["DHCP", "DNS", "ARP"],
  },
  {
    id: 35,
    question:
      "מהו המונח המתאר את היכולת של רשת לזהות ולתקן שגיאות בהעברת נתונים?",
    type: "multiple",
    correctAnswer: "בקרת שגיאות",
    incorrectAnswers: ["QoS", "Parity", "Checksum"],
  },
  {
    id: 36,
    question: "איזה פרוטוקול משמש לסנכרון זמן בין מחשבים ברשת?",
    type: "multiple",
    correctAnswer: "NTP",
    incorrectAnswers: ["SNMP", "ICMP", "STP"],
  },
  {
    id: 37,
    question: "מהו המונח המתאר את הפיצול של רשת גדולה לרשתות קטנות יותר?",
    type: "multiple",
    correctAnswer: "Subnetting",
    incorrectAnswers: ["VLAN", "Routing", "Switching"],
  },
  {
    id: 38,
    question: "איזה פרוטוקול משמש לניהול והעברת מידע על מצב הרשת?",
    type: "multiple",
    correctAnswer: "SNMP",
    incorrectAnswers: ["SMTP", "ICMP", "IGMP"],
  },
  {
    id: 39,
    question: "מהו המונח המתאר את הקצאת משאבי רשת לפי סדר עדיפויות?",
    type: "multiple",
    correctAnswer: "QoS",
    incorrectAnswers: [
      "Load Balancing",
      "Traffic Shaping",
      "Bandwidth Throttling",
    ],
  },
  {
    id: 40,
    question: "איזה פרוטוקול משמש ליצירת רשתות פרטיות וירטואליות?",
    type: "multiple",
    correctAnswer: "VPN",
    incorrectAnswers: ["VLAN", "VoIP", "VPLS"],
  },
  {
    id: 41,
    question: "מהו המונח המתאר את הזמן שלוקח לחבילת מידע לעשות סיבוב שלם ברשת?",
    type: "multiple",
    correctAnswer: "RTT (Round Trip Time)",
    incorrectAnswers: ["Latency", "Jitter", "Throughput"],
  },
  {
    id: 42,
    question: "איזה סוג של התקפת רשת מנסה להציף שרת בבקשות כדי להפיל אותו?",
    type: "multiple",
    correctAnswer: "DDoS",
    incorrectAnswers: ["Phishing", "Man-in-the-Middle", "SQL Injection"],
  },
  {
    id: 43,
    question: "מהו הפרוטוקול המשמש לשיתוף קבצים ומדפסות ברשתות Windows?",
    type: "multiple",
    correctAnswer: "SMB",
    incorrectAnswers: ["NFS", "AFP", "WebDAV"],
  },
  {
    id: 44,
    question: "איזה מנגנון משמש למניעת לולאות ברשתות מתגים?",
    type: "multiple",
    correctAnswer: "STP (Spanning Tree Protocol)",
    incorrectAnswers: ["OSPF", "BGP", "RIP"],
  },
  {
    id: 45,
    question: "מהו המונח המתאר את היכולת לחבר ולנתק התקנים מרשת תוך כדי פעולה?",
    type: "multiple",
    correctAnswer: "Hot-plugging",
    incorrectAnswers: ["Plug and Play", "BYOD", "IoT"],
  },
  {
    id: 46,
    question: "איזה פרוטוקול משמש להעברת מידע על קבצים ותיקיות ברשת?",
    type: "multiple",
    correctAnswer: "NFS",
    incorrectAnswers: ["SMB", "FTP", "SFTP"],
  },
  {
    id: 47,
    question:
      "מהו המונח המתאר את החלוקה הלוגית של רשת פיזית אחת למספר רשתות וירטואליות?",
    type: "multiple",
    correctAnswer: "VLAN",
    incorrectAnswers: ["VPN", "Subnet", "DMZ"],
  },
  {
    id: 48,
    question: "איזה פרוטוקול משמש לניתוב דינמי ברשתות גדולות?",
    type: "multiple",
    correctAnswer: "BGP",
    incorrectAnswers: ["RIP", "OSPF", "EIGRP"],
  },
  {
    id: 49,
    question: "האם פרוטוקול HTTP משתמש ב-TCP כפרוטוקול השכבה התחתונה שלו?",
    type: "yesno",
    correctAnswer: true,
    explanation:
      "כן, HTTP משתמש ב-TCP (Transmission Control Protocol) כפרוטוקול השכבה התחתונה שלו. TCP מבטיח העברת נתונים אמינה ומסודרת, מה שחיוני לתקשורת אינטרנט.",
  },
  {
    id: 50,
    question: "האם כתובת MAC יכולה להשתנות?",
    type: "yesno",
    correctAnswer: false,
    explanation:
      "לא, כתובת MAC (Media Access Control) היא בדרך כלל קבועה וייחודית לכל כרטיס רשת. היא נקבעת על ידי היצרן ומוטבעת בחומרה, אם כי ניתן לשנותה באופן תוכנתי במקרים מסוימים.",
  },
  {
    id: 51,
    question: "האם DNS משמש להקצאת כתובות IP?",
    type: "yesno",
    correctAnswer: false,
    explanation:
      "לא, DNS (Domain Name System) משמש לתרגום שמות דומיין לכתובות IP, ולא להקצאת כתובות IP. להקצאת כתובות IP משתמשים בפרוטוקול DHCP (Dynamic Host Configuration Protocol).",
  },
  {
    id: 52,
    question: "האם HTTPS מספק הגנה מפני האזנות (eavesdropping)?",
    type: "yesno",
    correctAnswer: true,
    explanation:
      "כן, HTTPS (HTTP Secure) מספק הגנה מפני האזנות. הוא משתמש בהצפנה (בדרך כלל SSL/TLS) כדי להבטיח שהתקשורת בין הדפדפן והשרת תהיה מוצפנת ומאובטחת.",
  },
  {
    id: 53,
    question: "האם כל הרשתות משתמשות באותו גודל של חבילות מידע (packets)?",
    type: "yesno",
    correctAnswer: false,
    explanation:
      "לא, גודל החבילות יכול להשתנות בין רשתות שונות ופרוטוקולים שונים. לדוגמה, הגודל המקסימלי של חבילת Ethernet הוא 1518 בתים, בעוד שב-IPv4 הגודל המקסימלי הוא 65,535 בתים.",
  },
  {
    id: 54,
    question: "האם IPv6 משתמש בכתובות ארוכות יותר מאשר IPv4?",
    type: "yesno",
    correctAnswer: true,
    explanation:
      "כן, IPv6 משתמש בכתובות ארוכות יותר. כתובת IPv4 היא באורך 32 סיביות, בעוד שכתובת IPv6 היא באורך 128 סיביות, מה שמאפשר הרבה יותר כתובות ייחודיות.",
  },
  {
    id: 55,
    question: "האם פרוטוקול UDP מבטיח העברת נתונים אמינה?",
    type: "yesno",
    correctAnswer: false,
    explanation:
      "לא, UDP (User Datagram Protocol) אינו מבטיח העברת נתונים אמינה. הוא מספק העברת נתונים מהירה יותר מ-TCP, אך ללא אישור קבלה או סדר מובטח של החבילות.",
  },
  {
    id: 56,
    question: "האם ניתן להשתמש ב-VPN כדי לעקוף הגבלות גיאוגרפיות?",
    type: "yesno",
    correctAnswer: true,
    explanation:
      "כן, VPN (Virtual Private Network) יכול לשמש לעקיפת הגבלות גיאוגרפיות. הוא מאפשר למשתמש להתחבר לשרת במיקום אחר, ובכך לגשת לתוכן שעשוי להיות חסום במיקומו הפיזי.",
  },
  {
    id: 57,
    question: "האם Firewall יכול להגן מפני כל סוגי ההתקפות ברשת?",
    type: "yesno",
    correctAnswer: false,
    explanation:
      "לא, למרות שחומת אש (Firewall) היא כלי חשוב באבטחת רשת, היא אינה יכולה להגן מפני כל סוגי ההתקפות. היא מגנה בעיקר מפני התקפות חיצוניות, אך פחות יעילה נגד איומים פנימיים או התקפות מתוחכמות שעוקפות את החומה.",
  },
  
];

export default networksQuestions;
