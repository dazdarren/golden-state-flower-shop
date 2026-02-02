export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  publishedAt: string;
  dateModified?: string;
  readTime: number;
  tags: string[];
  // Location-specific content (use {cityName} placeholder)
  localTitle?: string;
  localExcerpt?: string;
  localIntro?: string;
  localOutro?: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'best-flowers-for-mothers-day',
    title: "The Best Flowers for Mother's Day: A Complete Guide",
    excerpt: "Make Mother's Day unforgettable with the perfect floral arrangement. Discover which flowers convey love, gratitude, and appreciation.",
    content: `
Mother's Day is one of the most important occasions to show your love and appreciation. The right flowers can express what words sometimes cannot.

## Top Flower Choices for Mom

### 1. Roses
Classic and timeless, roses symbolize love and gratitude. Pink roses are especially perfect for Mother's Day, representing admiration and grace.

### 2. Peonies
If your mom loves lush, romantic blooms, peonies are an excellent choice. They represent prosperity, good luck, and happy marriage.

### 3. Lilies
Elegant and fragrant, lilies symbolize motherhood and fertility. Stargazer lilies are particularly striking with their bold pink petals.

### 4. Orchids
For moms who appreciate sophisticated beauty, orchids convey love, luxury, and strength. They also last much longer than cut flowers.

### 5. Tulips
Cheerful and bright, tulips represent perfect love. A bouquet of pink or purple tulips makes a lovely Mother's Day gift.

## Tips for Choosing the Right Arrangement

- **Consider her favorite colors**: Does she love pastels or bold hues?
- **Think about her style**: Classic, modern, or garden-fresh?
- **Add personal touches**: Include her favorite flowers or meaningful blooms
- **Don't forget a heartfelt card**: Your words mean as much as the flowers

## When to Order

For the best selection and guaranteed delivery, we recommend ordering your Mother's Day flowers at least 3-5 days in advance. Same-day delivery is available for last-minute orders placed before our cutoff time.
    `.trim(),
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&h=675&fit=crop',
    category: 'Gift Guide',
    publishedAt: '2024-04-15',
    readTime: 5,
    tags: ["Mother's Day", 'Gift Ideas', 'Roses', 'Spring Flowers'],
    localTitle: "Best Mother's Day Flowers in {cityName}",
    localExcerpt: "Find the perfect Mother's Day flowers for delivery in {cityName}. Discover which blooms convey love, gratitude, and appreciation for Mom.",
    localIntro: "Looking for the perfect Mother's Day flowers in {cityName}? You're in the right place. We deliver beautiful arrangements to moms throughout the {cityName} area, with same-day delivery available for last-minute orders.",
    localOutro: "Ready to order Mother's Day flowers in {cityName}? Browse our Mother's Day collection and schedule delivery to any address in the {cityName} area. Order early to guarantee delivery on Mom's special day!",
  },
  {
    slug: 'how-to-keep-flowers-fresh-longer',
    title: 'Expert Tips: How to Keep Your Flowers Fresh for Weeks',
    excerpt: 'Learn professional florist secrets to extend the life of your cut flowers and enjoy your beautiful arrangement longer.',
    content: `
Nothing beats the beauty of fresh flowers, but watching them wilt can be disappointing. With these professional tips, you can keep your blooms looking gorgeous for up to two weeks or more.

## The Basics: Setting Up for Success

### 1. Start with a Clean Vase
Bacteria is the enemy of fresh flowers. Wash your vase thoroughly with soap and warm water before arranging your flowers.

### 2. Use Room Temperature Water
Most flowers prefer room temperature water. Add the provided flower food packet, or make your own with 2 tablespoons of sugar and 2 tablespoons of white vinegar per quart of water.

### 3. Trim Stems at an Angle
Cut 1-2 inches off the stems at a 45-degree angle. This increases the surface area for water absorption and prevents stems from sitting flat on the vase bottom.

## Daily Maintenance

### Change the Water
Replace the water every 2-3 days, or whenever it looks cloudy. Fresh water means fewer bacteria and healthier flowers.

### Remove Dying Blooms
As individual flowers fade, remove them promptly. Dying flowers release ethylene gas that accelerates wilting in healthy blooms.

### Keep Away from Heat
Place your arrangement away from direct sunlight, heating vents, and fruit bowls (fruit releases ethylene gas).

## Pro Tips from Our Florists

- **Refrigerate overnight**: If possible, place your arrangement in the refrigerator overnight when you're not enjoying them
- **Mist delicate blooms**: Orchids and hydrangeas benefit from a light misting
- **Re-cut stems**: Every time you change the water, give stems a fresh cut
- **Use vodka**: A few drops of vodka in the water can help inhibit bacterial growth

## Flowers That Last Longest

Some flowers naturally have longer vase lives:
- Chrysanthemums (2-3 weeks)
- Carnations (2-3 weeks)
- Orchids (2-3 weeks)
- Lilies (10-14 days)
- Roses (7-10 days with proper care)
    `.trim(),
    image: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1200&h=675&fit=crop',
    category: 'Flower Care',
    publishedAt: '2024-03-20',
    readTime: 6,
    tags: ['Flower Care', 'Tips', 'Fresh Flowers', 'How To'],
    localTitle: 'How to Keep Flowers Fresh in {cityName}',
    localExcerpt: "Learn professional florist secrets to extend the life of your cut flowers in {cityName}'s climate and enjoy your beautiful arrangement longer.",
    localIntro: "When you receive fresh flowers delivered in {cityName}, you want them to last as long as possible. The local climate can affect how long your blooms stay fresh, but with these professional tips, you can enjoy your arrangement for weeks.",
    localOutro: "Order fresh flowers for delivery anywhere in {cityName} and put these tips to use! Our arrangements arrive with care instructions and flower food to help your blooms last longer in your home.",
  },
  {
    slug: 'meaning-of-flower-colors',
    title: 'The Language of Flowers: What Each Color Means',
    excerpt: 'Discover the hidden meanings behind flower colors and choose the perfect bouquet to express your exact sentiment.',
    content: `
Flowers have been used to communicate emotions for centuries. Understanding the meaning behind flower colors can help you choose the perfect arrangement for any occasion.

## Red Flowers: Passion and Love

Red is the color of romance and deep emotion. Red roses are the classic symbol of romantic love, while red carnations represent admiration and affection.

**Best for**: Valentine's Day, anniversaries, romantic gestures

## Pink Flowers: Grace and Gratitude

Pink flowers convey gentleness, admiration, and appreciation. Light pink suggests sweetness and innocence, while hot pink represents gratitude and thanks.

**Best for**: Mother's Day, thank you gifts, new baby celebrations

## White Flowers: Purity and Sympathy

White symbolizes purity, innocence, and new beginnings. White flowers are appropriate for weddings, sympathy arrangements, and religious ceremonies.

**Best for**: Weddings, sympathy, baptisms, fresh starts

## Yellow Flowers: Joy and Friendship

Bright and cheerful, yellow flowers represent happiness, friendship, and new beginnings. They're perfect for brightening someone's day.

**Best for**: Get well wishes, friendship, congratulations, cheer-up gifts

## Orange Flowers: Energy and Enthusiasm

Orange combines the passion of red with the happiness of yellow. Orange flowers convey excitement, enthusiasm, and warmth.

**Best for**: Celebrations, congratulations, autumn occasions

## Purple Flowers: Royalty and Admiration

Purple has long been associated with royalty and elegance. Lavender flowers suggest refinement, while deep purple conveys admiration.

**Best for**: Dignified occasions, showing respect, elegant celebrations

## Blue Flowers: Tranquility and Trust

Blue flowers are rare and precious, representing peace, tranquility, and trust. They create serene, calming arrangements.

**Best for**: Sympathy, relaxation, unique gifts

## Combining Colors

Don't be afraid to mix colors for a more nuanced message:
- Red + White = Unity and togetherness
- Pink + White = Innocent love
- Yellow + Orange = Warm wishes and enthusiasm
- Purple + White = Elegant admiration
    `.trim(),
    image: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=1200&h=675&fit=crop',
    category: 'Flower Knowledge',
    publishedAt: '2024-02-28',
    readTime: 7,
    tags: ['Flower Meanings', 'Color Guide', 'Gift Ideas', 'Symbolism'],
  },
  {
    slug: 'sympathy-flowers-etiquette',
    title: 'Sympathy Flowers Etiquette: A Thoughtful Guide',
    excerpt: 'Navigate the sensitive topic of sending sympathy flowers with grace. Learn what to send, when, and how to express condolences.',
    content: `
Sending sympathy flowers is a meaningful way to show support during difficult times. This guide will help you navigate this sensitive gesture with thoughtfulness and care.

## When to Send Sympathy Flowers

### To the Funeral Home
Flowers sent to the funeral home or church should arrive before the service begins. Order at least a day in advance.

### To the Family Home
Flowers sent to the family's home can arrive anytime, even weeks after the service. This is often appreciated when the initial rush of support subsides.

## Appropriate Flower Types

### Traditional Choices
- **Lilies**: Symbol of the soul's return to innocence
- **Roses**: Classic expression of love and respect
- **Chrysanthemums**: Represent honor and grief in many cultures
- **Carnations**: Long-lasting tribute of love

### Arrangement Styles
- **Standing sprays**: Displayed at the service
- **Casket pieces**: Placed on the casket
- **Basket arrangements**: Easy to transport and display
- **Plants**: Long-lasting memorial gift

## Color Guidelines

- **White**: Traditional, symbolizes peace and purity
- **Soft pastels**: Gentle and comforting
- **The deceased's favorites**: A personal touch if known
- **Avoid**: Bright, festive colors like orange or hot pink

## What to Write on the Card

Keep your message sincere and simple:
- "With deepest sympathy"
- "In loving memory of [name]"
- "Thinking of you during this difficult time"
- "May these flowers bring a moment of peace"

Include your full name so the family knows who sent the arrangement.

## Religious Considerations

Different traditions have varying customs:
- **Jewish funerals**: Flowers are often not displayed; consider a plant or donation
- **Catholic services**: Flowers are appropriate and welcomed
- **Buddhist ceremonies**: White and yellow flowers are preferred
- **Hindu traditions**: Wreaths and garlands are appropriate

## After the Service

Consider sending flowers or a plant to the family's home a few weeks after the funeral. This is when support is often most needed and appreciated.
    `.trim(),
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=1200&h=675&fit=crop',
    category: 'Etiquette',
    publishedAt: '2024-02-10',
    readTime: 8,
    tags: ['Sympathy', 'Etiquette', 'Funeral Flowers', 'Condolences'],
    localTitle: 'Sympathy Flowers Etiquette in {cityName}',
    localExcerpt: 'Navigate sending sympathy flowers in {cityName} with grace. Learn what to send, when, and how to express condolences with thoughtful flower delivery.',
    localIntro: "Sending sympathy flowers in {cityName} is a meaningful way to show support during difficult times. We deliver to all {cityName} funeral homes, churches, and private residences with same-day service available.",
    localOutro: "We understand how important it is to send your condolences with care. Our {cityName} sympathy flower delivery includes a personal card message and delivery confirmation. We're here to help you through this difficult time.",
  },
  {
    slug: 'seasonal-flowers-guide',
    title: 'Seasonal Flowers: What Blooms When in California',
    excerpt: "Discover which flowers are in peak season throughout the year and how to choose the freshest, most beautiful blooms.",
    content: `
California's mild climate means we enjoy a wonderful variety of flowers year-round. Here's your guide to what's freshest each season.

## Spring (March - May)

Spring brings an explosion of color and fragrance.

**In Season:**
- Tulips
- Daffodils
- Peonies (late spring)
- Ranunculus
- Sweet peas
- Lilacs
- Cherry blossoms

**Best For:** Easter, Mother's Day, spring weddings

## Summer (June - August)

Summer offers bold, vibrant blooms that thrive in warm weather.

**In Season:**
- Sunflowers
- Dahlias
- Zinnias
- Hydrangeas
- Lavender
- Garden roses
- Lisianthus

**Best For:** Summer parties, outdoor events, cheerful gifts

## Fall (September - November)

Autumn brings rich, warm-toned flowers perfect for the season.

**In Season:**
- Chrysanthemums
- Marigolds
- Dahlias (continue)
- Celosia
- Protea
- Dried flowers and grasses

**Best For:** Thanksgiving, harvest celebrations, fall weddings

## Winter (December - February)

Even in winter, beautiful flowers are available.

**In Season:**
- Amaryllis
- Paperwhites
- Camellias
- Anemones
- Hellebores
- Poinsettias (holiday)
- Roses (year-round greenhouse)

**Best For:** Holiday arrangements, Valentine's Day, winter celebrations

## Year-Round Favorites

Some flowers are available throughout the year:
- Roses
- Carnations
- Lilies
- Orchids
- Alstroemeria
- Eucalyptus and greenery

## Benefits of Choosing Seasonal

1. **Freshness**: Seasonal flowers haven't traveled far
2. **Value**: More abundant means better prices
3. **Beauty**: Flowers at their peak are most vibrant
4. **Sustainability**: Lower environmental impact

When you order from us, we prioritize seasonal and locally-grown flowers whenever possible, ensuring you receive the freshest arrangements.
    `.trim(),
    image: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=1200&h=675&fit=crop',
    category: 'Flower Knowledge',
    publishedAt: '2024-01-15',
    readTime: 6,
    tags: ['Seasonal', 'California', 'Fresh Flowers', 'Guide'],
  },
  {
    slug: 'valentines-day-flower-guide',
    title: "Valentine's Day Flowers: What to Send and What They Mean",
    excerpt: "Choose the perfect Valentine's Day flowers with our complete guide to romantic blooms, color meanings, and ordering tips.",
    content: `
Valentine's Day is the biggest flower-giving holiday of the year. Whether you're in a new relationship or celebrating decades together, the right flowers make a lasting impression.

## Classic Choices for Valentine's Day

### Red Roses
The timeless symbol of romantic love. A dozen red roses is the traditional Valentine's gift, but don't feel bound by convention. A single perfect rose can be just as meaningful.

- **1 rose**: Love at first sight
- **6 roses**: I want to be yours
- **12 roses**: Be mine
- **24 roses**: I'm yours forever

### Beyond Red Roses

Not everyone wants the expected. Consider these romantic alternatives:

- **Pink roses**: Perfect for new relationships or deep appreciation
- **Peonies**: Lush, romantic, and increasingly popular
- **Ranunculus**: Delicate layers perfect for someone who appreciates detail
- **Tulips**: Simple elegance, especially in red or pink
- **Orchids**: Sophisticated and long-lasting

## Choosing by Relationship Stage

### New Relationship (Under 6 Months)
Keep it thoughtful but not overwhelming. A beautiful mixed bouquet or a modest arrangement of her favorite flowers shows you pay attention without being too intense.

### Established Relationship (6 Months - 2 Years)
This is the time for classic romance. Red roses, a romantic dinner, and a heartfelt card work beautifully together.

### Long-Term Partners
You know them best. Consider their favorite flowers, colors, or something unexpected. A blooming plant they can enjoy for months might mean more than cut flowers.

## Ordering Tips for Valentine's Day

### Order Early
Valentine's Day is the busiest day of the year for florists. Order at least a week in advance for the best selection and guaranteed delivery.

### Be Specific About Delivery
If you want flowers delivered to their workplace for maximum impact, confirm the office address and hours. For home delivery, make sure someone will be there to receive them.

### Consider the Presentation
A beautiful vase, handwritten card, and quality wrapping elevate any arrangement. These details show extra thought.

## What to Write on the Card

Keep it personal and sincere:
- "Every day with you is a gift. Happy Valentine's Day."
- "You make my life more beautiful. Love always."
- "To many more years of adventures together."

Avoid generic messages. A few heartfelt words you actually mean beat a lengthy quote you found online.
    `.trim(),
    image: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=1200&h=675&fit=crop',
    category: 'Gift Guide',
    publishedAt: '2024-01-28',
    readTime: 7,
    tags: ["Valentine's Day", 'Roses', 'Romance', 'Gift Ideas'],
    localTitle: "Valentine's Day Flowers in {cityName}: What to Send",
    localExcerpt: "Find the perfect Valentine's Day flowers for delivery in {cityName}. Our complete guide to romantic blooms, color meanings, and ordering tips.",
    localIntro: "Valentine's Day is the biggest flower-giving holiday of the year, and {cityName} is no exception. Whether you're sending roses to a downtown office or surprising someone at home, we deliver romantic arrangements throughout the {cityName} area.",
    localOutro: "Order your Valentine's Day flowers for {cityName} delivery now. We recommend ordering at least a week in advance to secure your preferred arrangement and delivery time slot. Same-day delivery available for orders placed before 2pm.",
  },
  {
    slug: 'anniversary-flowers-by-year',
    title: 'Anniversary Flowers by Year: The Traditional Guide',
    excerpt: 'Discover the traditional flower for each wedding anniversary year, from carnations for year one to lilies for year 30.',
    content: `
Each wedding anniversary has a traditional flower associated with it. Following this tradition adds meaning to your gift and shows thoughtfulness.

## Year-by-Year Anniversary Flowers

### Year 1: Carnations
Carnations symbolize young, passionate love. Their ruffled petals represent the layers of a new marriage still being discovered. Choose red for deep love or pink for gratitude.

### Year 2: Lily of the Valley
These delicate white bells represent sweetness and humility. They remind couples to treasure simple moments together.

### Year 3: Sunflowers
Bright and cheerful, sunflowers symbolize adoration, loyalty, and longevity. They represent a marriage that's found its footing and faces the future with optimism.

### Year 4: Geraniums
Geraniums represent comfort and stability. By year four, couples have built routines and found their rhythm together.

### Year 5: Daisies
The fifth anniversary brings daisies, symbolizing innocence, loyal love, and purity. A milestone worth celebrating with these cheerful blooms.

### Year 6: Calla Lilies
Elegant and sophisticated, calla lilies represent magnificent beauty. They reflect a marriage that's grown more refined over time.

### Year 7: Freesia
Freesia symbolizes trust and thoughtfulness. By year seven, deep trust has been established and tested.

### Year 8: Lilac
Lilacs represent the first emotions of love. For an eighth anniversary, they remind couples of how their love began.

### Year 9: Bird of Paradise
These exotic flowers symbolize joy, paradise, and freedom. They celebrate a marriage that's truly taken flight.

### Year 10: Daffodils
A decade of marriage deserves the cheerful optimism of daffodils. They represent new beginnings, rebirth, and the promise of many more years.

## Major Milestone Anniversaries

### Year 15: Roses
Fifteen years calls for the classic beauty of roses. Any color is appropriate, but deep red honors the depth of a 15-year love.

### Year 20: Asters
Asters symbolize wisdom and devotion. Twenty years of marriage brings both.

### Year 25: Iris
The silver anniversary deserves the elegant iris, representing faith, hope, and wisdom. Purple iris is particularly fitting.

### Year 30: Lilies
Lilies represent devotion and partnership. Thirty years of marriage is a remarkable achievement worth celebrating grandly.

### Year 40: Gladiolus
The ruby anniversary brings gladiolus, symbolizing strength of character, faithfulness, and moral integrity.

### Year 50: Yellow Roses and Violets
The golden anniversary combines yellow roses (joy, mature love) with violets (faithfulness). Fifty years together is extraordinary.

## Creating Your Anniversary Arrangement

You don't have to use only the traditional flower. Consider:

- **Combining traditional with favorites**: Mix the anniversary flower with your spouse's favorites
- **Adding meaningful touches**: Include flowers from your wedding bouquet
- **Choosing quality over quantity**: One perfect bloom can mean more than a large arrangement

## What to Write

Reference your journey:
- "10 years, countless memories, infinite love."
- "Every year with you is a gift. Happy 5th anniversary."
- "To the love of my life on our 25th - you're still my favorite."
    `.trim(),
    image: 'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?w=1200&h=675&fit=crop',
    category: 'Gift Guide',
    publishedAt: '2024-05-10',
    readTime: 8,
    tags: ['Anniversary', 'Wedding', 'Traditions', 'Gift Ideas'],
  },
  {
    slug: 'get-well-flowers-hospital-delivery',
    title: 'Get Well Flowers: Hospital Delivery Tips and Best Choices',
    excerpt: 'Learn which flowers are appropriate for hospital visits, delivery tips, and how to brighten someone\'s recovery.',
    content: `
Sending flowers to someone recovering in the hospital is a thoughtful gesture that can lift spirits during a difficult time. Here's what you need to know about hospital flower delivery.

## Hospital Delivery Basics

### Check Hospital Policies First
Many hospitals have flower policies, especially for certain units:

- **ICU**: Often no flowers allowed due to infection control
- **Maternity wards**: Usually flowers are welcome
- **Oncology units**: May restrict flowers due to patient immune systems
- **Allergy units**: Typically no flowers permitted
- **General rooms**: Usually accept flower deliveries

We always call ahead to confirm delivery is permitted.

### Delivery Timing
Hospital deliveries are typically accepted during daytime hours only, usually 8am to 6pm. Flowers delivered after hours may be held at the reception desk until the next day.

### Include Complete Information
Provide the patient's full name, room number (if known), and the hospital's full address. Room numbers can change, so the name is most important.

## Best Flowers for Hospital Rooms

### Choose Low-Fragrance Options
Strong floral scents can overwhelm patients, especially those experiencing nausea or sensitivity. Good choices include:

- **Tulips**: Minimal fragrance, cheerful colors
- **Gerbera daisies**: Bright and virtually scentless
- **Sunflowers**: Uplifting without strong scent
- **Roses**: Light fragrance, universally loved
- **Carnations**: Long-lasting, mild scent

### Avoid Strongly Scented Flowers
Skip these for hospital deliveries:

- Lilies (especially stargazers)
- Hyacinths
- Gardenias
- Freesias

### Consider Plant Alternatives
A potted plant can be a great choice:

- **Succulents**: Easy care, long-lasting
- **Orchids**: Elegant, minimal fragrance
- **Peace lily**: Air-purifying, easy care

## Size Matters

Hospital rooms are small. Choose compact arrangements that:

- Fit on a bedside table or windowsill
- Don't block the TV or doorway
- Are easy for staff to move if needed
- Can go home with the patient easily

Avoid large standing arrangements or elaborate displays.

## What to Include with Get Well Flowers

### A Thoughtful Card
Keep messages positive and supportive:

- "Thinking of you and wishing you a speedy recovery."
- "Sending sunshine your way. Get well soon!"
- "Rest up and feel better. We miss you!"

Avoid messages that minimize their experience ("You'll be fine!") or express excessive worry ("I'm so worried about you!").

### Practical Additions
Consider adding:

- A small stuffed animal (especially for children)
- A book or magazine
- Cozy socks
- A card that others can sign

## After Hospitalization

If hospital delivery isn't possible or the patient has been discharged, send flowers to their home. This is often even more appreciated, as the recovery period at home can be lonely.

## Ongoing Recovery

For extended recoveries, consider a flower subscription or follow-up delivery a few weeks after the initial gift. Continued support means a lot when someone is healing.
    `.trim(),
    image: 'https://images.unsplash.com/photo-1471899236350-e3016bf1e69e?w=1200&h=675&fit=crop',
    category: 'Etiquette',
    publishedAt: '2024-06-05',
    readTime: 7,
    tags: ['Get Well', 'Hospital', 'Recovery', 'Etiquette'],
    localTitle: 'Get Well Flowers: Hospital Delivery in {cityName}',
    localExcerpt: "Learn which flowers are appropriate for hospital visits in {cityName}, delivery tips, and how to brighten someone's recovery.",
    localIntro: "Sending get-well flowers to someone recovering in {cityName}? We deliver to all major hospitals in the area and can help you choose the perfect arrangement. Here's what you need to know about hospital flower delivery.",
    localOutro: "Ready to send get-well wishes? We deliver to all {cityName} hospitals and medical centers. Our team calls ahead to confirm delivery policies and ensure your flowers arrive safely. Order before 2pm for same-day hospital delivery.",
  },
  {
    slug: 'wedding-flowers-complete-guide',
    title: 'Wedding Flowers: A Complete Planning Guide',
    excerpt: 'Everything you need to know about wedding flowers, from bouquets to centerpieces, seasonal choices, and budgeting tips.',
    content: `
Wedding flowers set the tone for your entire celebration. This guide covers everything from choosing your blooms to working with florists.

## Types of Wedding Flowers

### Bridal Bouquet
The star of wedding flowers. Common styles include:

- **Round/Posy**: Compact, classic dome shape
- **Cascade**: Flowers draping downward, dramatic and elegant
- **Hand-tied**: Loose, garden-gathered look
- **Nosegay**: Small, tightly packed round bouquet
- **Pageant**: Long-stemmed flowers cradled in the arm

### Bridesmaids' Bouquets
Typically smaller versions of the bridal bouquet or complementary arrangements. They should coordinate without competing with the bride's flowers.

### Boutonnieres
Small arrangements worn on lapels by the groom, groomsmen, fathers, and ushers. Usually a single bloom or small cluster.

### Ceremony Flowers
- Altar arrangements
- Pew or chair markers
- Arch or chuppah decorations
- Aisle runners with petals

### Reception Flowers
- Centerpieces (tall or low)
- Head table arrangements
- Cake flowers
- Cocktail table accents
- Restroom touches

## Choosing Your Wedding Flowers

### Consider Your Season

**Spring Weddings**
- Peonies, ranunculus, tulips, lilac, sweet peas
- Soft pastels work beautifully

**Summer Weddings**
- Dahlias, garden roses, hydrangeas, sunflowers
- Bold colors shine

**Fall Weddings**
- Chrysanthemums, marigolds, amaranthus, dried elements
- Rich, warm tones

**Winter Weddings**
- Amaryllis, anemones, roses, evergreens
- Deep reds, whites, metallics

### Match Your Venue
- **Formal ballroom**: Elegant roses, orchids, structured arrangements
- **Garden party**: Loose, romantic, garden-style arrangements
- **Beach wedding**: Tropical flowers, relaxed arrangements
- **Rustic barn**: Wildflowers, greenery, natural elements

### Consider Color Palette
Start with 2-3 main colors, then add accents. Common approaches:

- **Monochromatic**: Various shades of one color
- **Complementary**: Colors opposite on the color wheel
- **Analogous**: Colors next to each other on the color wheel

## Budgeting for Wedding Flowers

### Average Costs
Wedding flowers typically account for 8-10% of the total wedding budget. Expect to spend:

- Bridal bouquet: $150-350
- Bridesmaids' bouquets: $75-150 each
- Boutonnieres: $15-35 each
- Centerpieces: $75-250 each
- Ceremony arrangements: $200-500

### Money-Saving Tips

- **Choose in-season flowers**: More available means better prices
- **Use more greenery**: Eucalyptus, ferns, and foliage cost less
- **Repurpose ceremony flowers**: Move altar arrangements to reception
- **Skip flowers in some areas**: Not every surface needs blooms
- **Choose locally grown**: Reduces transportation costs

## Working with a Florist

### Questions to Ask
- Can I see examples of your wedding work?
- What flowers will be in season for my date?
- How do you handle setup and delivery?
- What's your cancellation policy?
- Will you be at my wedding personally?

### Timeline
- **9-12 months before**: Book florist, discuss vision
- **4-6 months before**: Finalize designs and flowers
- **2 months before**: Confirm all details
- **1 week before**: Final walkthrough

## Preserving Your Bouquet

Options for keeping your wedding flowers:

- **Pressing**: Flatten in a book or frame
- **Drying**: Hang upside down to air dry
- **Freeze-drying**: Professional preservation maintains color
- **Resin**: Encase in clear resin as art piece
    `.trim(),
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=675&fit=crop',
    category: 'Gift Guide',
    publishedAt: '2024-07-15',
    readTime: 10,
    tags: ['Wedding', 'Planning', 'Bouquets', 'Centerpieces'],
  },
  {
    slug: 'office-flowers-corporate-gifting',
    title: 'Office Flowers and Corporate Gifting: A Professional Guide',
    excerpt: 'Navigate workplace flower etiquette, from congratulating colleagues to impressing clients with thoughtful corporate gifts.',
    content: `
Flowers in professional settings require different considerations than personal gifts. Here's how to navigate corporate flower gifting with confidence.

## When to Send Office Flowers

### Appropriate Occasions

- **Promotions and achievements**: Celebrate career milestones
- **Work anniversaries**: Recognize tenure and loyalty
- **Retirement**: Honor years of service
- **New job congratulations**: Welcome new team members
- **Client appreciation**: Strengthen business relationships
- **Holiday gifts**: Show year-end appreciation
- **Condolences**: Support during loss
- **Get well wishes**: Show concern during illness

### Use Discretion For

- **Personal occasions at work**: Birthdays, baby showers (check office culture)
- **Romantic gestures**: Generally not appropriate for workplace delivery
- **After disagreements**: Can seem manipulative in professional context

## Choosing Professional Arrangements

### Keep It Appropriate

- **Neutral, elegant colors**: Whites, greens, soft yellows
- **Classic flowers**: Roses, orchids, lilies, hydrangeas
- **Modest size**: Should fit comfortably on a desk
- **Low fragrance**: Strong scents can bother coworkers
- **Quality over quantity**: One elegant orchid beats a cheap mixed bouquet

### Avoid

- **Overly romantic arrangements**: Red roses, heart themes
- **Strong fragrances**: Stargazer lilies, gardenias
- **Oversized arrangements**: Impractical for office spaces
- **Cheap-looking flowers**: Reflects poorly on sender

## Plants for the Office

Living plants make excellent corporate gifts:

- **Orchids**: Elegant, long-lasting, professional appearance
- **Succulents**: Low maintenance, modern aesthetic
- **Peace lilies**: Air-purifying, easy care
- **Snake plants**: Virtually indestructible, sleek look

Plants last longer than cut flowers and provide ongoing enjoyment.

## Corporate Account Benefits

For businesses that send flowers regularly, consider setting up a corporate account:

- **Streamlined ordering**: Save recipient addresses and preferences
- **Consistent quality**: Same standards for all recipients
- **Consolidated billing**: One invoice for all orders
- **Volume pricing**: Discounts for regular orders
- **Dedicated support**: Priority assistance when needed

## Client Gift Guidelines

### Building Relationships
Regular flower gifts to key clients show appreciation without expecting anything immediate in return. Good times to send:

- After closing a deal
- During holidays
- On company anniversaries
- Following successful projects
- When you read about their achievements

### Compliance Considerations
Many companies have gift policies. Before sending to corporate clients:

- Check if they accept gifts
- Respect any dollar limits
- Keep accurate records for your company
- Avoid anything that could appear as a bribe

## Reception and Lobby Displays

For businesses wanting flowers in their own space:

### Weekly Arrangements
Fresh flowers in reception areas create a welcoming impression. We offer:

- Weekly delivery schedules
- Seasonal rotations
- Custom designs matching your brand
- Maintenance and disposal included

### Event Flowers
For corporate events, meetings, or conferences:

- Conference table arrangements
- Registration desk displays
- Stage decorations
- Branded elements when appropriate

## What to Write on Corporate Cards

Keep messages professional:

- "Congratulations on your well-deserved promotion."
- "Wishing you continued success in your new role."
- "Thank you for your partnership and trust."
- "With appreciation for your years of dedication."

Sign with your name and company, keeping the tone warm but professional.
    `.trim(),
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=675&fit=crop',
    category: 'Etiquette',
    publishedAt: '2024-08-20',
    readTime: 8,
    tags: ['Corporate', 'Office', 'Business', 'Professional'],
  },
  {
    slug: 'graduation-flowers-gift-ideas',
    title: 'Graduation Flowers: Celebrate Their Achievement',
    excerpt: 'Find the perfect flowers for graduation ceremonies, from high school to PhD. Tips for delivery, presentation, and school colors.',
    content: `
Graduation marks years of hard work and dedication. Flowers are a classic way to honor this milestone, whether it's kindergarten or doctoral degree.

## Best Flowers for Graduation

### Traditional Choices

- **Roses**: Classic celebration flower, available in every color
- **Lilies**: Elegant and fragrant, perfect for marking achievements
- **Sunflowers**: Bright and optimistic, representing a bright future
- **Orchids**: Sophisticated choice for advanced degrees
- **Mixed bouquets**: Colorful celebration of their accomplishment

### Matching School Colors
A thoughtful touch is incorporating the graduate's school colors:

- **Stanford**: Cardinal red roses
- **UC Berkeley**: Blue and gold arrangements
- **San Francisco State**: Purple and gold flowers
- **Santa Clara**: Red and white blooms

We can create custom arrangements in almost any color combination.

## Delivery Options

### To the Ceremony
Many graduation venues accept flower deliveries for pickup. Contact the venue in advance to arrange:

- Delivery location (registration area, will call)
- Pickup procedures
- Size restrictions (stadiums may limit large arrangements)

### To Their Seat
Most venues don't allow seat delivery during ceremonies. Plan for the graduate to collect flowers after or at a designated meeting spot.

### After-Party Delivery
Send flowers to the celebration venue or family home for display during the party.

### Dorm or Apartment
If they're returning to school or moving to a new city, send flowers to arrive when they do.

## Presentation Ideas

### Hand-Tied Bouquet
The classic choice. Easy to carry, photograph, and display. Consider adding:

- Ribbon in school colors
- A small graduation charm
- Wrapped stems for easy carrying

### Boxed Arrangement
Elegant presentation that's easy to transport. The box doubles as a vase.

### Single Rose
For kindergarten or elementary graduations, a single rose is age-appropriate and manageable for small hands.

### Lei of Flowers
Popular in many cultures, flower leis are worn during the ceremony. Orchid or tuberose leis are traditional, but any flowers can be strung.

## By Education Level

### Kindergarten/Elementary
Keep it simple and fun:
- Single flower or small posy
- Bright, cheerful colors
- Easy to hold and carry

### Middle/High School
Step up the presentation:
- Hand-tied bouquet
- School colors
- Add a balloon or small gift

### College/University
Match their achievement:
- Elegant mixed bouquet
- Sophisticated colors
- Quality wrapping and presentation

### Graduate/Professional School
Honor years of advanced study:
- Premium flowers (orchids, garden roses)
- Elegant, sophisticated arrangements
- Consider a lasting plant

## What to Write

Acknowledge their hard work:

- "All your hard work has paid off. Congratulations, graduate!"
- "So proud of everything you've accomplished. The future is yours."
- "Today you close one chapter and begin an even more exciting one."
- "Years of dedication led to this moment. Celebrate—you've earned it!"

For advanced degrees:
- "Dr. [Name] has a nice ring to it. Congratulations!"
- "Masters of your craft and now Masters degree. Well done!"

## Gift Add-Ons

Consider pairing flowers with:

- **Gift card**: For their next chapter (Target, Amazon, their new city)
- **Photo frame**: For diploma or graduation photo
- **Professional accessories**: For those entering the workforce
- **Luggage or travel items**: For study abroad or moving away
    `.trim(),
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=675&fit=crop',
    category: 'Gift Guide',
    publishedAt: '2024-05-01',
    readTime: 6,
    tags: ['Graduation', 'Celebration', 'Achievement', 'School'],
    localTitle: 'Graduation Flowers in {cityName}: Celebrate Their Achievement',
    localExcerpt: 'Find the perfect graduation flowers for delivery in {cityName}. From high school to PhD, tips for delivery, presentation, and school colors.',
    localIntro: "Graduation season in {cityName} is a time of celebration! Whether your graduate is finishing high school, college, or an advanced degree, flowers are a classic way to honor their achievement. We deliver to graduation venues and homes throughout {cityName}.",
    localOutro: "Celebrate your graduate with beautiful flowers delivered anywhere in {cityName}. We offer same-day delivery for last-minute orders and can coordinate delivery to graduation venues. Browse our congratulations collection to find the perfect arrangement!",
  },
  {
    slug: 'thank-you-flowers-when-how',
    title: 'Thank You Flowers: When to Send and What to Choose',
    excerpt: 'Express gratitude beautifully with flowers. Learn when thank you flowers are appropriate and which blooms convey appreciation.',
    content: `
Flowers are one of the most gracious ways to express gratitude. Whether someone helped you through a tough time or hosted a lovely dinner, thank you flowers leave a lasting impression.

## When to Send Thank You Flowers

### Always Appropriate

- **After staying at someone's home**: The classic hostess gift
- **Following a dinner party**: Thank the host for their hospitality
- **After receiving a favor**: When someone goes out of their way
- **To thank a mentor**: Recognize guidance and support
- **After job interviews**: Stand out from other candidates (send within 24 hours)
- **To healthcare providers**: Thank nurses, doctors, or caregivers
- **After receiving a referral**: When someone helps your business grow

### Consider the Relationship

- **Professional contacts**: Keep arrangements modest and appropriate
- **Close friends**: More personal touches are welcome
- **Family**: Match their style and preferences
- **New acquaintances**: Don't overwhelm; keep it thoughtful but simple

## Best Flowers for Saying Thank You

### Flowers That Mean "Thank You"

- **Pink roses**: Gratitude and appreciation
- **Hydrangeas**: Heartfelt thanks and understanding
- **Sweet peas**: Thank you for a lovely time
- **Gerbera daisies**: Cheerful appreciation
- **Campanula**: Gratitude (also called "bellflower")

### Color Meanings for Gratitude

- **Pink**: Grace, gratitude, appreciation
- **Yellow**: Friendship, joy, thanks for brightening my day
- **Peach**: Sincere thanks, closing a deal well
- **Lavender**: Admiration and appreciation

### Arrangements to Consider

- **Hand-tied bouquet**: Personal and thoughtful
- **Vase arrangement**: Ready to display immediately
- **Potted plant**: Long-lasting appreciation
- **Orchid**: Sophisticated, appropriate for professional thanks

## Thank You Flowers for Specific Situations

### After a Job Interview
Send a small, professional arrangement within 24 hours:
- Modest size (desk-appropriate)
- Neutral colors (avoid red/romantic)
- Include a handwritten card referencing the conversation
- Don't overdo it—one thoughtful gesture is enough

### For Healthcare Workers
Hospital and clinic policies vary:
- Call ahead to confirm delivery is permitted
- Choose low-fragrance flowers
- Address to the specific unit or person
- A card thanking the whole team is thoughtful

### Hostess Gifts
When thanking someone for hosting:
- Bring flowers or send them the next day
- Match the flowers to their home style if you know it
- Include a note about what you enjoyed

### Business Referrals
When someone sends business your way:
- Thank them within a week
- Keep arrangements professional
- A quality orchid or elegant arrangement works well
- Include a handwritten note, not just the florist's card

## Writing Thank You Messages

Be specific about what you're thankful for:

**General:**
- "Thank you for your thoughtfulness. It meant more than you know."
- "Your kindness made all the difference. Thank you from the bottom of my heart."

**For Hospitality:**
- "Thank you for the wonderful evening. Your hospitality was truly special."
- "What a lovely weekend! Thank you for welcoming us into your home."

**For Professional Help:**
- "Thank you for taking the time to meet with me. I appreciated learning about the opportunity."
- "Your referral meant a great deal. Thank you for thinking of me."

**For Support:**
- "Thank you for being there when I needed it most."
- "Your support during a difficult time was a true gift. Thank you."

## Timing Matters

- **Same day or next day**: Dinner parties, interviews, immediate favors
- **Within a week**: Hosting, significant help, referrals
- **Anytime**: Better late than never for heartfelt thanks

The sooner you send thank you flowers, the more impactful they'll be. But genuine gratitude is always welcome, even if delayed.
    `.trim(),
    image: 'https://images.unsplash.com/photo-1457089328109-e5d9bd499191?w=1200&h=675&fit=crop',
    category: 'Etiquette',
    publishedAt: '2024-09-10',
    readTime: 7,
    tags: ['Thank You', 'Gratitude', 'Etiquette', 'Gift Ideas'],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return blogPosts.map((post) => post.slug);
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter((post) => post.category === category);
}

export function getRecentPosts(count: number = 3): BlogPost[] {
  return [...blogPosts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, count);
}

export function getAllCategories(): string[] {
  return Array.from(new Set(blogPosts.map((post) => post.category)));
}
