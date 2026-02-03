/**
 * Guide content configuration for the content marketing hub
 * Each guide includes city-personalizable content, schema markup, and internal linking
 */

export interface GuideSection {
  heading: string;
  content: string;
}

export interface GuideFAQ {
  question: string;
  answer: string;
}

export interface GuideStep {
  title: string;
  description: string;
}

export interface GuideConfig {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  heroImage?: string;
  schemaType: 'Article' | 'HowTo' | 'FAQPage';
  readingTime: string;
  category: string;
  featured?: boolean;
  relatedOccasions: string[];
  sections: GuideSection[];
  faqs?: GuideFAQ[];
  steps?: GuideStep[];
  // Internal linking
  relatedBlogPosts?: string[]; // Blog post slugs
  contextPages?: string[]; // Page types this guide relates to (e.g., 'hospital', 'product', 'funeral-home')
}

export const GUIDES: GuideConfig[] = [
  {
    slug: 'flower-care',
    title: 'How to Keep Flowers Fresh Longer',
    metaTitle: 'How to Keep Flowers Fresh Longer | Flower Care Tips',
    metaDescription: 'Learn expert tips to keep your flower arrangements fresh for up to 2 weeks. Proper water, trimming, and placement advice from professional florists.',
    excerpt: 'Discover proven techniques from professional florists to extend the life of your flower arrangements and keep blooms looking beautiful for up to two weeks.',
    schemaType: 'HowTo',
    readingTime: '5 min read',
    category: 'Flower Care',
    featured: true,
    relatedOccasions: ['birthday', 'anniversary', 'just-because'],
    steps: [
      {
        title: 'Trim the stems at an angle',
        description: 'Cut 1-2 inches off the bottom of each stem at a 45-degree angle. This increases the surface area for water absorption and prevents stems from sitting flat on the vase bottom.',
      },
      {
        title: 'Remove leaves below the waterline',
        description: 'Strip any leaves that would be submerged in water. Submerged foliage breeds bacteria that shortens flower life.',
      },
      {
        title: 'Use clean, lukewarm water',
        description: 'Fill your vase with room-temperature water. Cold water can shock flowers, while lukewarm water is absorbed more easily.',
      },
      {
        title: 'Add flower food or make your own',
        description: 'Use the provided flower food packet, or mix 2 tablespoons lemon juice, 1 tablespoon sugar, and 1/2 teaspoon bleach per quart of water.',
      },
      {
        title: 'Place away from heat and direct sunlight',
        description: 'Keep flowers in a cool spot away from heating vents, appliances, and direct sun. Heat accelerates wilting.',
      },
      {
        title: 'Change water every 2-3 days',
        description: 'Replace the water completely and re-trim stems each time. This prevents bacterial growth and keeps flowers hydrated.',
      },
    ],
    sections: [
      {
        heading: 'Why Fresh Flowers Wilt',
        content: 'Understanding why flowers wilt helps you prevent it. Once cut, flowers no longer receive nutrients from their roots. They depend entirely on water absorption through their stems. Bacteria in the water, air bubbles in the stems, and dehydration all contribute to early wilting. By addressing each of these factors, you can significantly extend your flowers\' lifespan.',
      },
      {
        heading: 'Best Flowers for Longevity',
        content: 'Some flowers naturally last longer than others. Chrysanthemums, carnations, and alstroemeria can last 2-3 weeks with proper care. Roses and lilies typically last 7-10 days. Tulips and daffodils have shorter lifespans of 5-7 days but offer unique beauty worth the trade-off.',
      },
      {
        heading: 'Special Tips for Roses',
        content: 'Roses benefit from slightly cooler water and benefit from having their guard petals (the outermost petals that protect the bud during shipping) gently removed. If rose heads begin to droop, you can revive them by submerging the entire stem in warm water for 30 minutes.',
      },
    ],
    faqs: [
      {
        question: 'Should I put flowers in the refrigerator?',
        answer: 'You can refrigerate flowers overnight to extend their life, but keep them away from fruits and vegetables, which release ethylene gas that causes flowers to age faster.',
      },
      {
        question: 'Can I use tap water for flowers?',
        answer: 'Yes, tap water is fine for most flowers. If your water is heavily chlorinated, let it sit for an hour before adding flowers, or use filtered water.',
      },
      {
        question: 'Why are my flowers drooping even in water?',
        answer: 'Drooping usually indicates an air bubble in the stem blocking water uptake. Re-cut the stems underwater and they should perk up within a few hours.',
      },
    ],
    relatedBlogPosts: ['how-to-keep-flowers-fresh-longer'],
    contextPages: ['product'],
  },
  {
    slug: 'sympathy-etiquette',
    title: 'Sympathy Flower Etiquette Guide',
    metaTitle: 'Sympathy Flower Etiquette: What to Send & When',
    metaDescription: 'Complete guide to sympathy flower etiquette. Learn appropriate arrangements, timing, card messages, and delivery options for funerals and condolences.',
    excerpt: 'Navigate the sensitive process of sending sympathy flowers with confidence. Learn what to send, when to send it, and how to express your condolences appropriately.',
    schemaType: 'Article',
    readingTime: '7 min read',
    category: 'Etiquette',
    featured: true,
    relatedOccasions: ['sympathy'],
    sections: [
      {
        heading: 'Types of Sympathy Arrangements',
        content: 'Sympathy flowers come in several forms, each appropriate for different situations. Standing sprays and wreaths are typically sent to the funeral service. Casket sprays are ordered by the immediate family. Basket arrangements and plants are appropriate for the family\'s home. Smaller bouquets can be sent to the workplace or home after the service.',
      },
      {
        heading: 'When to Send Sympathy Flowers',
        content: 'Timing depends on where you\'re sending flowers. For funeral services, arrange delivery 2-3 hours before the service begins. For the family\'s home, you can send flowers immediately after learning of the loss, during the week following the funeral, or on significant dates like the one-month or one-year anniversary. Sending flowers a few weeks after the funeral is especially thoughtful, as this is when support often diminishes.',
      },
      {
        heading: 'Choosing Appropriate Flowers',
        content: 'White flowers traditionally symbolize peace and purity, making them a safe choice. Lilies are classic sympathy flowers symbolizing the restored innocence of the soul. Roses express love and respect. Chrysanthemums represent loyalty and honor. Consider the deceased\'s favorite flowers or colors to add a personal touch. When in doubt, consult with a florist who can guide you.',
      },
      {
        heading: 'Writing the Card Message',
        content: 'Keep card messages simple and sincere. Express your sympathy, share a brief positive memory if appropriate, and offer support. Avoid clichés like "they\'re in a better place" which may not comfort everyone. Examples: "With deepest sympathy during this difficult time," "Thinking of you and your family," or "[Name] brought so much joy to everyone who knew them."',
      },
      {
        heading: 'Cultural and Religious Considerations',
        content: 'Different cultures and religions have varying traditions around funeral flowers. In Jewish tradition, flowers are generally not sent to the funeral but may be sent to the family\'s home. Some Asian cultures prefer white flowers, while others avoid them. Catholic services welcome flowers at the funeral home. When uncertain, it\'s appropriate to ask the funeral home or send a plant or donation instead.',
      },
    ],
    faqs: [
      {
        question: 'Can I send flowers to a funeral if I can\'t attend?',
        answer: 'Sending flowers is a thoughtful way to express condolences when you cannot attend in person. Include a card explaining your connection to the deceased or the family.',
      },
      {
        question: 'Is it appropriate to send flowers for a cremation service?',
        answer: 'Yes, flowers are appropriate for cremation services. Smaller arrangements or plants are often preferred over large standing sprays.',
      },
      {
        question: 'What if the obituary says "in lieu of flowers"?',
        answer: 'Respect the family\'s wishes by making a donation to the specified charity. You can still send a small plant or card to the family\'s home after the service.',
      },
    ],
    relatedBlogPosts: ['sympathy-flowers-etiquette'],
    contextPages: ['funeral-home'],
  },
  {
    slug: 'hospital-delivery',
    title: 'Hospital Flower Delivery: What You Need to Know',
    metaTitle: 'Hospital Flower Delivery Guide | Rules & Best Practices',
    metaDescription: 'Everything you need to know about sending flowers to hospitals. Learn delivery rules, restricted areas, best flower choices, and timing for {cityName} hospitals.',
    excerpt: 'Sending flowers to someone in the hospital? Learn the rules, restrictions, and best practices to ensure your thoughtful gift arrives safely and brightens their day.',
    schemaType: 'Article',
    readingTime: '6 min read',
    category: 'Delivery Guide',
    relatedOccasions: ['get-well'],
    sections: [
      {
        heading: 'Hospital Flower Policies',
        content: 'Most hospitals accept flower deliveries during regular visiting hours, but policies vary by facility and unit. ICU and critical care units often prohibit flowers due to infection concerns. Oncology and immunocompromised patient units may also restrict flowers. Maternity wards typically welcome flowers, though some request no strongly scented varieties. Always check with the specific hospital before ordering.',
      },
      {
        heading: 'Best Flowers for Hospital Delivery',
        content: 'Choose cheerful, low-maintenance arrangements. Avoid heavily fragrant flowers like lilies or hyacinths, as scents can be overwhelming in hospital rooms. Plants and succulents are excellent alternatives that last longer than cut flowers. Balloon bouquets with a small floral accent work well when flowers are restricted. Bright, colorful arrangements help brighten sterile hospital environments.',
      },
      {
        heading: 'Timing Your Delivery',
        content: 'Schedule delivery during regular visiting hours, typically 9 AM to 8 PM. Morning deliveries are often best, giving patients something to enjoy all day. Avoid meal times when staff are busiest. Confirm the patient will still be admitted on your delivery date, as hospital stays can change unexpectedly. Consider calling the nurses\' station the morning of delivery to confirm.',
      },
      {
        heading: 'Information to Include',
        content: 'Provide complete information for successful delivery: patient\'s full legal name (as registered with the hospital), room number if known, the hospital\'s full name and address, and your contact information. If you don\'t know the room number, the hospital\'s main entrance can usually direct deliveries to the correct unit.',
      },
      {
        heading: 'Alternatives When Flowers Are Restricted',
        content: 'If flowers aren\'t allowed, consider these alternatives: potted plants (often permitted where cut flowers aren\'t), balloon arrangements, gift baskets with snacks or magazines, cozy items like blankets or slippers, or a card with a promise to deliver flowers once they\'re home. A small stuffed animal or comforting item can also brighten their stay.',
      },
    ],
    faqs: [
      {
        question: 'Can I send flowers to the emergency room?',
        answer: 'ER flower deliveries are typically not accepted because patients move frequently. Wait until the patient is in a regular room, or deliver to their home after discharge.',
      },
      {
        question: 'Will the hospital call me if delivery fails?',
        answer: 'Hospitals rarely notify senders of failed deliveries. Work with a local florist who will attempt redelivery or contact you if there are issues.',
      },
      {
        question: 'How do I find out a patient\'s room number?',
        answer: 'Call the hospital\'s main line and ask for the patient information desk. They can confirm the patient is admitted and may provide the room number if the patient has not requested privacy.',
      },
    ],
    relatedBlogPosts: ['get-well-flowers-hospital-delivery'],
    contextPages: ['hospital'],
  },
  {
    slug: 'flower-meanings',
    title: 'Birthday Flower Meanings by Color',
    metaTitle: 'Birthday Flower Meanings: Color Guide & Symbolism',
    metaDescription: 'Discover the meaning behind flower colors for birthdays. Learn what each color symbolizes and choose the perfect arrangement to express your feelings.',
    excerpt: 'Every flower color carries its own meaning and message. Learn the symbolism behind different hues to choose birthday flowers that perfectly express your sentiments.',
    schemaType: 'Article',
    readingTime: '5 min read',
    category: 'Flower Meanings',
    featured: true,
    relatedOccasions: ['birthday', 'just-because', 'thank-you'],
    sections: [
      {
        heading: 'Red Flowers: Love and Passion',
        content: 'Red flowers express deep love and passionate feelings. Red roses are the classic symbol of romantic love, while red tulips declare perfect love. Red carnations show admiration and affection. Choose red flowers for a spouse, romantic partner, or someone you love deeply. For friends and family, opt for lighter reds or pair with other colors.',
      },
      {
        heading: 'Pink Flowers: Grace and Gratitude',
        content: 'Pink flowers convey grace, gentility, and gratitude. Light pink suggests admiration and sympathy, while hot pink expresses appreciation and thanks. Pink roses symbolize gratitude and joy. Pink is perfect for mothers, sisters, friends, and anyone you appreciate. It\'s feminine without being overtly romantic.',
      },
      {
        heading: 'Yellow Flowers: Joy and Friendship',
        content: 'Yellow flowers radiate happiness, optimism, and friendship. They brighten any room and any mood. Yellow roses celebrate friendship without romantic implications. Sunflowers represent adoration and loyalty. Send yellow flowers to friends, colleagues, or anyone who needs their day brightened. They\'re perfect for celebrating achievements and new beginnings.',
      },
      {
        heading: 'White Flowers: Purity and New Beginnings',
        content: 'White flowers symbolize purity, innocence, and new beginnings. White lilies represent restored purity, while white roses indicate reverence and humility. Choose white for milestone birthdays, religious celebrations, or when you want to express respect. White arrangements feel elegant and sophisticated.',
      },
      {
        heading: 'Purple Flowers: Royalty and Admiration',
        content: 'Purple flowers convey royalty, dignity, and admiration. Lavender represents elegance and grace, while deep purple suggests mystery and enchantment. Purple flowers are perfect for someone you deeply admire or want to celebrate in style. They make a striking impression for milestone birthdays.',
      },
      {
        heading: 'Orange Flowers: Energy and Enthusiasm',
        content: 'Orange flowers burst with energy, enthusiasm, and excitement. They represent warmth, encouragement, and passion for life. Orange lilies symbolize confidence, while orange roses express desire and excitement. Choose orange for adventurous, energetic personalities or to encourage someone facing a challenge.',
      },
    ],
    faqs: [
      {
        question: 'What colors should I avoid for a birthday?',
        answer: 'There are no strict rules, but white alone can feel too formal, and some cultures associate it with mourning. When in doubt, combine white with colorful accents.',
      },
      {
        question: 'Do mixed color arrangements have meaning?',
        answer: 'Mixed arrangements generally convey joy and celebration without specific symbolism. They\'re a safe choice when you want to brighten someone\'s day without sending a particular message.',
      },
    ],
    relatedBlogPosts: ['meaning-of-flower-colors', 'thank-you-flowers-when-how'],
    contextPages: ['product'],
  },
  {
    slug: 'valentines-guide',
    title: 'Complete Valentine\'s Day Flower Guide',
    metaTitle: 'Valentine\'s Day Flowers: Complete Ordering Guide',
    metaDescription: 'Plan the perfect Valentine\'s Day flowers. Learn what to order, when to order, romantic alternatives to roses, and delivery tips for {cityName}.',
    excerpt: 'Make this Valentine\'s Day unforgettable with the perfect floral gift. From classic roses to unique alternatives, learn everything you need to plan the perfect romantic gesture.',
    schemaType: 'Article',
    readingTime: '8 min read',
    category: 'Holiday Guide',
    relatedOccasions: ['love-romance', 'anniversary'],
    sections: [
      {
        heading: 'Planning Ahead: Why Early Ordering Matters',
        content: 'Valentine\'s Day is the busiest day of the year for florists. Ordering early—ideally 1-2 weeks ahead—ensures you get the arrangement you want at the best price. Last-minute orders may face limited selection and rush fees. Most florists stop taking same-day orders for Valentine\'s Day by noon on February 13th.',
      },
      {
        heading: 'Classic Red Roses: What the Numbers Mean',
        content: 'The number of roses carries its own message. A single rose says "love at first sight." A dozen roses is the classic expression of "be mine." Two dozen roses convey "I\'m yours." Fifty roses declare "unconditional love." One hundred roses represent complete devotion. Choose the number that matches the message you want to send.',
      },
      {
        heading: 'Beyond Red Roses: Romantic Alternatives',
        content: 'While red roses are traditional, other flowers express romance beautifully. Peonies represent romance and prosperity. Ranunculus symbolize radiant charm. Tulips declare perfect love. Orchids convey refined beauty and luxury. Garden roses offer old-world romance with their lush petals and sweet fragrance. Consider your partner\'s favorite colors and flowers for a personal touch.',
      },
      {
        heading: 'Delivery Timing Tips',
        content: 'For maximum impact, consider delivery timing carefully. Work delivery creates a public declaration of love that colleagues will notice. Home delivery in the evening sets the mood for a romantic night. Some couples prefer morning delivery to start Valentine\'s Day beautifully. If your partner works from home, time delivery for a midday surprise to break up their day.',
      },
      {
        heading: 'Adding to Your Floral Gift',
        content: 'Enhance your flowers with thoughtful additions. Chocolates pair classically with roses. A handwritten card means more than any printed message. Consider a vase upgrade for arrangements they can reuse. For long-distance relationships, include a video call date invitation. Some florists offer bear or balloon add-ons, though simpler often feels more sophisticated.',
      },
      {
        heading: 'What to Write in Your Card',
        content: 'Skip generic messages and write from the heart. Reference a shared memory, inside joke, or future plans you\'re excited about. Express specific things you love about them. Keep it appropriate for workplace delivery if applicable. Even a simple "I love you" feels profound when handwritten. Consider including song lyrics or quotes that are meaningful to your relationship.',
      },
    ],
    faqs: [
      {
        question: 'How much should I spend on Valentine\'s Day flowers?',
        answer: 'There\'s no right amount—it depends on your budget and relationship. A thoughtfully chosen $50 arrangement can mean more than an extravagant one. Focus on quality and personalization over price.',
      },
      {
        question: 'Is it too cliché to send roses on Valentine\'s Day?',
        answer: 'Roses are classics for a reason—they\'re beautiful and universally understood as romantic. If you want to be unique, choose an unusual rose color or mix roses with other flowers.',
      },
      {
        question: 'What if Valentine\'s Day falls on a weekend?',
        answer: 'Many florists deliver on weekends, especially around Valentine\'s Day. Book early and confirm delivery availability. Consider Friday delivery for maximum workplace impact.',
      },
    ],
    relatedBlogPosts: ['valentines-day-flower-guide'],
  },
  {
    slug: 'wedding-flowers',
    title: 'Wedding Flower Planning Guide',
    metaTitle: 'Wedding Flower Guide: Planning, Budgeting & Seasonal Tips',
    metaDescription: 'Complete wedding flower planning guide. Learn about bridal bouquets, centerpieces, seasonal availability, budgeting tips, and working with florists in {cityName}.',
    excerpt: 'Plan your dream wedding flowers with confidence. From choosing your bridal bouquet to budgeting for centerpieces, this guide covers everything you need to know.',
    schemaType: 'Article',
    readingTime: '10 min read',
    category: 'Wedding',
    relatedOccasions: ['anniversary', 'love-romance'],
    sections: [
      {
        heading: 'Types of Wedding Flowers You\'ll Need',
        content: 'Wedding flowers include several categories: the bridal bouquet (your statement piece), bridesmaid bouquets (typically smaller versions of the bridal bouquet), boutonnieres for the groom and groomsmen, corsages for mothers and grandmothers, ceremony arrangements (altar flowers, pew markers, arches), and reception flowers (centerpieces, cake flowers, accent arrangements). Start by prioritizing which elements matter most to you.',
      },
      {
        heading: 'Choosing Your Bridal Bouquet Style',
        content: 'Bridal bouquet styles include: round (classic, compact dome shape), cascading (dramatic flowers flowing downward), hand-tied (loose, garden-gathered look), posy (small and simple), and presentation (cradled in the arm). Consider your dress style—a dramatic gown pairs well with a simple bouquet, while a minimalist dress can handle more elaborate flowers. Your bouquet should complement, not compete with, your dress.',
      },
      {
        heading: 'Seasonal Flower Availability',
        content: 'Choosing in-season flowers saves money and ensures freshness. Spring offers peonies, ranunculus, tulips, and sweet peas. Summer brings garden roses, dahlias, and sunflowers. Fall features chrysanthemums, marigolds, and rich dahlias. Winter showcases amaryllis, anemones, and evergreens. Year-round options include roses, calla lilies, and orchids. Out-of-season flowers cost more and may need to be imported.',
      },
      {
        heading: 'Wedding Flower Budget Tips',
        content: 'Flowers typically represent 8-10% of your wedding budget. Save money by: choosing in-season blooms, using more greenery and fewer statement flowers, repurposing ceremony flowers at the reception, opting for potted plants guests can take home, selecting local varieties, and being flexible with specific flowers while staying consistent with color palette. Splurge where it matters—your bridal bouquet and head table centerpiece are most photographed.',
      },
      {
        heading: 'Working with Your Florist',
        content: 'Book your florist 6-9 months before the wedding. Bring inspiration photos, fabric swatches, and venue photos to your consultation. Be clear about your budget upfront. Ask about their style and request to see photos of similar weddings. Discuss backup plans for flower availability. Confirm delivery and setup times. A good florist will guide you toward beautiful alternatives if your first choices are unavailable or over budget.',
      },
      {
        heading: 'Preserving Your Wedding Flowers',
        content: 'Many brides want to preserve their bouquet. Options include: pressing flowers in a frame, silica gel drying for 3D preservation, professional freeze-drying (most expensive but best results), resin casting for jewelry or paperweights, or having an artist paint your bouquet. Decide before the wedding so your florist can prepare the bouquet appropriately. Some preservation methods work better with certain flower types.',
      },
    ],
    faqs: [
      {
        question: 'How far in advance should I book a wedding florist?',
        answer: 'Book your florist 6-9 months before the wedding, especially for peak wedding season (May-October). Popular florists book up quickly, and you\'ll want time for consultations and trials.',
      },
      {
        question: 'Can I do my own wedding flowers?',
        answer: 'DIY wedding flowers are possible for smaller weddings but require significant time and skill. Consider DIY for simple elements like bud vases and leave complex arrangements to professionals. Order 20% extra flowers for mistakes.',
      },
      {
        question: 'What flowers should I avoid for outdoor weddings?',
        answer: 'Avoid delicate flowers like sweet peas and gardenias in hot weather—they wilt quickly. Roses, orchids, and succulents handle heat better. Discuss your venue\'s conditions with your florist.',
      },
    ],
    relatedBlogPosts: ['wedding-flowers-complete-guide'],
    contextPages: ['venue'],
  },
  {
    slug: 'corporate-flowers',
    title: 'Corporate Flower Gifting Guide',
    metaTitle: 'Corporate Flowers: Business Gifting Etiquette & Ideas',
    metaDescription: 'Professional guide to corporate flower gifting. Learn when to send flowers to clients, colleagues, and business partners, plus appropriate arrangements and messages.',
    excerpt: 'Navigate professional flower gifting with confidence. Learn the etiquette of sending flowers in business settings, from client appreciation to office celebrations.',
    schemaType: 'Article',
    readingTime: '6 min read',
    category: 'Business',
    relatedOccasions: ['thank-you', 'congratulations'],
    sections: [
      {
        heading: 'When to Send Corporate Flowers',
        content: 'Appropriate occasions for business flowers include: closing a major deal or contract, client or employee work anniversaries, promotions and achievements, office openings or relocations, retirement celebrations, expressing condolences, thanking clients for referrals, and holiday appreciation. Flowers create memorable impressions and strengthen business relationships when sent thoughtfully.',
      },
      {
        heading: 'Choosing Appropriate Arrangements',
        content: 'Corporate arrangements should be professional and tasteful. Opt for sophisticated colors like whites, greens, purples, and subtle oranges. Avoid overly romantic red roses or arrangements that could be misinterpreted. Orchids convey elegance and longevity. Succulents and plants suit modern office environments. Consider desk-appropriate sizes for individual recipients and larger statement pieces for office lobbies.',
      },
      {
        heading: 'Writing Professional Card Messages',
        content: 'Keep business card messages professional and sincere. Include your company name and the sender\'s name. Examples: "Congratulations on your well-deserved promotion. Best wishes, [Your Name], [Company]" or "Thank you for your continued partnership. We look forward to another successful year together." Avoid overly casual language or personal sentiments that could seem inappropriate.',
      },
      {
        heading: 'Delivery Considerations for Offices',
        content: 'Schedule delivery during business hours (9 AM - 5 PM). Provide complete address including suite or floor number. Include the recipient\'s full name and company name. Consider whether delivery to a receptionist is acceptable or if you need direct delivery. For high-security buildings, verify flower delivery policies in advance. Avoid Mondays (busy) and Fridays (recipient may leave early).',
      },
      {
        heading: 'Budget Guidelines by Relationship',
        content: 'Spending guidelines vary by relationship: $50-75 for colleagues and team members, $75-100 for valued clients and partners, $100-150 for C-suite executives and VIP clients, $150+ for major milestones like business acquisitions. When in doubt, err on the side of modest elegance. An overly lavish gift can create awkwardness or appear as inappropriate influence.',
      },
      {
        heading: 'Alternatives to Traditional Flowers',
        content: 'Consider alternatives for certain situations: potted orchids or plants for long-lasting impact, succulent gardens for modern offices, herb gardens for foodie executives, gift baskets combining flowers with gourmet items, or charitable donations in the recipient\'s name. Some companies have policies against accepting gifts—always verify before sending.',
      },
    ],
    faqs: [
      {
        question: 'Is it appropriate to send flowers to a male colleague?',
        answer: 'Yes, flowers are appropriate for anyone. For men, choose sophisticated arrangements with orchids, succulents, or structured designs rather than traditionally feminine pink bouquets.',
      },
      {
        question: 'Should I send flowers from myself or my company?',
        answer: 'For business relationships, send from your company name. For personal workplace relationships (like a colleague\'s personal milestone), sending from yourself is appropriate.',
      },
      {
        question: 'How do I handle flower allergies in the office?',
        answer: 'When sending to offices, consider low-allergen options like orchids, roses (minimal pollen), or plants. Avoid lilies, which have heavy pollen, and strongly scented flowers.',
      },
    ],
    relatedBlogPosts: ['office-flowers-corporate-gifting', 'graduation-flowers-gift-ideas'],
  },
  {
    slug: 'anniversary-flowers-by-year',
    title: 'Anniversary Flowers by Year: Traditional Guide',
    metaTitle: 'Anniversary Flowers by Year: Traditional & Modern Guide',
    metaDescription: 'Complete guide to anniversary flowers by milestone year. Learn traditional flower meanings for 1st through 50th anniversaries plus romantic presentation ideas.',
    excerpt: 'Celebrate each anniversary milestone with meaningful flowers. Discover the traditional and modern flower associations for every anniversary year.',
    schemaType: 'Article',
    readingTime: '7 min read',
    category: 'Anniversary',
    relatedOccasions: ['anniversary', 'love-romance'],
    sections: [
      {
        heading: 'Early Years: 1st Through 5th Anniversary',
        content: '1st Anniversary: Carnations symbolize young, passionate love with their bold colors and ruffled petals. 2nd Anniversary: Cosmos represent harmony in your growing relationship. 3rd Anniversary: Sunflowers embody loyalty, adoration, and longevity. 4th Anniversary: Geraniums signify comfort and happiness. 5th Anniversary: Daisies represent loyal love and innocence—perfect for celebrating five years of commitment.',
      },
      {
        heading: 'Growing Together: 6th Through 10th Anniversary',
        content: '6th Anniversary: Calla lilies symbolize magnificent beauty and devotion. 7th Anniversary: Freesias represent thoughtfulness and trust. 8th Anniversary: Lilacs signify first emotions of love, now deepened over time. 9th Anniversary: Bird of paradise represents joyfulness and excitement for the future. 10th Anniversary: Daffodils symbolize rebirth and new beginnings—perfect for a decade milestone.',
      },
      {
        heading: 'Milestone Years: 15th, 20th, and 25th',
        content: '15th Anniversary: Roses—specifically 15 roses to represent each year. 20th Anniversary: Asters represent love and patience, qualities that define two decades together. 25th Anniversary: Irises symbolize faith, wisdom, and valor. Silver anniversary arrangements often incorporate white and silver accents. This quarter-century milestone deserves an exceptional arrangement.',
      },
      {
        heading: 'The Golden Years: 30th Through 50th',
        content: '30th Anniversary: Lilies represent devotion and purity of commitment. 40th Anniversary: Gladiolus symbolize strength, honor, and moral integrity. 50th Anniversary: Yellow roses and violets represent the golden milestone—50 years of love, loyalty, and partnership. Golden anniversary arrangements often feature yellow blooms with gold accents.',
      },
      {
        heading: 'Rose Color Meanings for Anniversaries',
        content: 'Red roses: enduring romantic love. Pink roses: gratitude and appreciation. White roses: eternal love and new beginnings. Yellow roses: friendship and mature love. Orange roses: passion and enthusiasm. Lavender roses: enchantment and wonder. You can also gift the number of roses matching your anniversary year—25 roses for 25 years, etc.',
      },
      {
        heading: 'Creating a Meaningful Anniversary Tradition',
        content: 'Consider establishing an annual flower tradition. Plant a rose bush together each anniversary and watch your garden grow. Press a flower from each anniversary bouquet into a scrapbook. Take a photo with your flowers each year to create a visual timeline. Some couples give the traditional flower each year, creating anticipation for what each milestone brings.',
      },
    ],
    faqs: [
      {
        question: 'What if my partner doesn\'t like the traditional flower for our year?',
        answer: 'The traditional flowers are guidelines, not rules. Choose flowers your partner loves, or incorporate the traditional flower as an accent in a mixed arrangement they\'ll enjoy.',
      },
      {
        question: 'How many flowers should I include in an anniversary arrangement?',
        answer: 'A meaningful approach is to include the number of blooms matching your anniversary year—10 roses for 10 years, 25 for 25 years. For larger numbers, work with your florist to create a balanced arrangement.',
      },
      {
        question: 'What\'s appropriate for non-romantic partnership anniversaries?',
        answer: 'Business partnership or friendship anniversaries call for professional arrangements. Yellow flowers (friendship), green arrangements (growth), or white flowers (respect) work well.',
      },
    ],
    relatedBlogPosts: ['anniversary-flowers-by-year'],
  },
  {
    slug: 'mothers-day-guide',
    title: 'Complete Mother\'s Day Flower Guide',
    metaTitle: 'Mother\'s Day Flowers: Complete Planning & Ordering Guide',
    metaDescription: 'Plan the perfect Mother\'s Day flowers. Ordering timelines, flower meanings, delivery tips, and ideas for moms, grandmothers, and mother figures in {cityName}.',
    excerpt: 'Make Mom feel special with the perfect Mother\'s Day flowers. From ordering timelines to meaningful flower choices, plan a memorable floral gift for all the mothers in your life.',
    schemaType: 'Article',
    readingTime: '7 min read',
    category: 'Holiday Guide',
    relatedOccasions: ['thank-you', 'just-because'],
    sections: [
      {
        heading: 'When to Order Mother\'s Day Flowers',
        content: 'Mother\'s Day is the second-busiest flower holiday after Valentine\'s Day. Order at least one week in advance to ensure availability and avoid rush fees. Same-day delivery may not be available on Mother\'s Day itself. If ordering for Saturday delivery (the day before), book even earlier. Many florists stop taking Mother\'s Day orders by Friday noon.',
      },
      {
        heading: 'Traditional Mother\'s Day Flowers and Their Meanings',
        content: 'Carnations are the traditional Mother\'s Day flower—pink for living mothers, white in memory of mothers who\'ve passed. Pink roses express gratitude and appreciation. Tulips represent perfect love. Peonies symbolize prosperity and happy marriage. Orchids convey elegant beauty. Hydrangeas represent heartfelt emotions. Consider Mom\'s personal favorites alongside traditional choices.',
      },
      {
        heading: 'Gift Ideas for Different Mothers',
        content: 'For your mother: her favorite flowers or a premium arrangement that feels luxurious. For grandmothers: consider ease of care—orchids or plants that last. For mothers-in-law: classic, sophisticated arrangements avoid any awkwardness. For new moms: cheerful arrangements that brighten nursery time. For expecting mothers: avoid strongly scented flowers and consider gift cards for post-birth delivery.',
      },
      {
        heading: 'Delivery Planning for Mother\'s Day',
        content: 'Decide between Saturday delivery (giving you time together Sunday) or Sunday delivery (the surprise on the actual day). If Mom attends church, time delivery for after services. For brunch plans, consider smaller arrangements that travel well. If you\'re visiting in person, bringing flowers yourself adds a personal touch. For long-distance moms, schedule delivery and follow up with a video call.',
      },
      {
        heading: 'Beyond Cut Flowers: Lasting Gift Ideas',
        content: 'For moms who love gardening: potted flowers she can plant outside, like hydrangeas or roses. For busy moms: low-maintenance orchids or succulents. For sentimental moms: pressed flower jewelry or a subscription for monthly flower deliveries. For minimalist moms: a single stunning stem, like a large peony or orchid. For moms who have everything: donate to a flower-related charity in her name.',
      },
      {
        heading: 'Remembering Mothers Who\'ve Passed',
        content: 'Mother\'s Day can be difficult when honoring a mother who\'s passed. Consider placing flowers at her gravesite or memorial. White carnations traditionally honor deceased mothers. Some people donate flowers to nursing homes in their mother\'s memory. Plant a memorial garden or a specific tree or flower that reminds you of her. Acknowledge your grief while celebrating her memory.',
      },
    ],
    faqs: [
      {
        question: 'What if I have multiple mothers to celebrate (mom, grandmother, mother-in-law)?',
        answer: 'Many florists offer multi-recipient orders. Consider varying the arrangements slightly while keeping a cohesive style. Budget for all recipients when planning your Mother\'s Day flower spending.',
      },
      {
        question: 'Is it appropriate to send Mother\'s Day flowers to someone who isn\'t a mother?',
        answer: 'Many people celebrate mother figures—aunts, mentors, stepmothers, or friends who nurture. This is increasingly common and welcomed. Adjust your card message to honor their specific role.',
      },
      {
        question: 'My mother says she doesn\'t want flowers. Should I send them anyway?',
        answer: 'Respect her wishes. Some mothers genuinely prefer experiences or practical gifts. Consider alternatives like a plant she can enjoy long-term, a donation in her name, or a brunch date instead.',
      },
    ],
    relatedBlogPosts: ['best-flowers-for-mothers-day'],
  },
  {
    slug: 'seasonal-flower-calendar',
    title: 'Seasonal Flower Calendar: What\'s in Bloom When',
    metaTitle: 'Seasonal Flower Guide: What\'s in Bloom Each Month',
    metaDescription: 'Month-by-month guide to seasonal flowers. Learn what\'s freshest and most affordable throughout the year to plan beautiful, budget-friendly arrangements.',
    excerpt: 'Discover which flowers are at their peak each season. Choosing seasonal blooms means fresher flowers, better prices, and more sustainable arrangements.',
    schemaType: 'Article',
    readingTime: '8 min read',
    category: 'Flower Care',
    relatedOccasions: ['birthday', 'just-because', 'anniversary'],
    sections: [
      {
        heading: 'Spring Flowers (March - May)',
        content: 'Spring brings beloved flowers after winter\'s dormancy. March features daffodils, hyacinths, and early tulips. April is peak tulip season, plus ranunculus, anemones, and cherry blossoms. May showcases peonies (highly sought after), lilacs, and sweet peas. Spring flowers often symbolize renewal and fresh starts. Peonies have a very short season—typically just 3-4 weeks—so order early if they\'re your favorite.',
      },
      {
        heading: 'Summer Flowers (June - August)',
        content: 'Summer offers the widest variety and most vibrant colors. June brings garden roses, peonies (early June), and early dahlias. July features sunflowers, zinnias, dahlias, and delphinium. August showcases gladiolus, asters, and late-summer dahlias. Summer flowers are perfect for bold, colorful arrangements. Many summer blooms are locally grown, reducing cost and environmental impact.',
      },
      {
        heading: 'Fall Flowers (September - November)',
        content: 'Autumn brings warm, rich tones. September features dahlias (their peak), chrysanthemums, and marigolds. October offers dried elements, branches with berries, and ornamental grasses alongside mums. November transitions to winter with amaryllis, evergreens, and seasonal foliage. Fall arrangements often incorporate non-floral elements like wheat, acorns, and colorful leaves.',
      },
      {
        heading: 'Winter Flowers (December - February)',
        content: 'Winter relies more on imported flowers and evergreens. December features poinsettias, amaryllis, and holiday greens. January offers tulips (from greenhouses), anemones, and ranunculus. February brings the first spring previews plus Valentine\'s Day roses. Winter arrangements often incorporate interesting textures—berries, branches, pinecones, and succulents.',
      },
      {
        heading: 'Year-Round Flowers',
        content: 'Some flowers are available year-round thanks to global growing: roses (from Ecuador, Colombia), carnations, chrysanthemums, alstroemeria, calla lilies, and orchids. While always available, these flowers may be fresher and less expensive during their natural peak seasons. Orchids are a reliable year-round option that last 2-3 weeks with minimal care.',
      },
      {
        heading: 'Saving Money with Seasonal Choices',
        content: 'Seasonal flowers cost 30-50% less than out-of-season varieties. They\'re also fresher since they haven\'t traveled far. When working with a florist, ask what\'s currently at peak—they can create stunning arrangements with the freshest available blooms. Be flexible with specific flowers while staying consistent with colors or overall style.',
      },
    ],
    faqs: [
      {
        question: 'Why are peonies so expensive outside their season?',
        answer: 'Peonies have an extremely short growing season (late April to early June in most areas). Off-season peonies must be imported from the Southern Hemisphere, adding significant cost. Book peony arrangements early in the season.',
      },
      {
        question: 'Are grocery store flowers seasonal?',
        answer: 'Not typically. Most grocery store flowers are year-round varieties from large-scale farms. For truly seasonal flowers, visit a local florist or farmers market where growers sell their current harvests.',
      },
      {
        question: 'How do I find out what\'s currently in season locally?',
        answer: 'Ask local florists what\'s freshest this week. Visit farmers markets for locally grown options. In {cityName}, seasonal availability may differ from national trends due to local climate.',
      },
    ],
    relatedBlogPosts: ['seasonal-flowers-guide'],
  },
];

export function getGuideBySlug(slug: string): GuideConfig | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

/**
 * Get related guides using score-based matching
 * Scores guides based on shared occasions, categories, and context pages
 */
export function getRelatedGuides(currentSlug: string, limit: number = 3): GuideConfig[] {
  const currentGuide = getGuideBySlug(currentSlug);
  if (!currentGuide) {
    return GUIDES.slice(0, limit);
  }

  const scores = GUIDES
    .filter((guide) => guide.slug !== currentSlug)
    .map((guide) => {
      let score = 0;

      // Same category: +3 points
      if (guide.category === currentGuide.category) {
        score += 3;
      }

      // Shared occasions: +2 points each
      const sharedOccasions = guide.relatedOccasions.filter(
        (occ) => currentGuide.relatedOccasions.includes(occ)
      );
      score += sharedOccasions.length * 2;

      // Shared context pages: +2 points each
      if (currentGuide.contextPages && guide.contextPages) {
        const sharedPages = guide.contextPages.filter(
          (page) => currentGuide.contextPages?.includes(page)
        );
        score += sharedPages.length * 2;
      }

      // Featured bonus: +1 point
      if (guide.featured) {
        score += 1;
      }

      return { guide, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scores.map(({ guide }) => guide);
}

export function getFeaturedGuides(limit: number = 3): GuideConfig[] {
  return GUIDES.filter((g) => g.featured).slice(0, limit);
}

export function getGuidesByCategory(category: string): GuideConfig[] {
  return GUIDES.filter((g) => g.category === category);
}

export function getGuidesByOccasion(occasion: string): GuideConfig[] {
  return GUIDES.filter((g) => g.relatedOccasions.includes(occasion));
}

export function getAllCategories(): string[] {
  const categories = new Set(GUIDES.map((g) => g.category));
  return Array.from(categories);
}

/**
 * Get guides that are relevant for a specific context page type
 */
export function getGuidesByContextPage(contextPage: string): GuideConfig[] {
  return GUIDES.filter((g) => g.contextPages?.includes(contextPage));
}
