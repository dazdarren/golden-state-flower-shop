export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  publishedAt: string;
  readTime: number;
  tags: string[];
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
    image: '/images/blog/mothers-day-flowers.jpg',
    category: 'Gift Guide',
    publishedAt: '2024-04-15',
    readTime: 5,
    tags: ["Mother's Day", 'Gift Ideas', 'Roses', 'Spring Flowers'],
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
    image: '/images/blog/flower-care-tips.jpg',
    category: 'Flower Care',
    publishedAt: '2024-03-20',
    readTime: 6,
    tags: ['Flower Care', 'Tips', 'Fresh Flowers', 'How To'],
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
    image: '/images/blog/flower-colors-meaning.jpg',
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
    image: '/images/blog/sympathy-flowers.jpg',
    category: 'Etiquette',
    publishedAt: '2024-02-10',
    readTime: 8,
    tags: ['Sympathy', 'Etiquette', 'Funeral Flowers', 'Condolences'],
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
    image: '/images/blog/seasonal-flowers.jpg',
    category: 'Flower Knowledge',
    publishedAt: '2024-01-15',
    readTime: 6,
    tags: ['Seasonal', 'California', 'Fresh Flowers', 'Guide'],
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
