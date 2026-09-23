import type { LessonTopic, SubjectManifest } from '../types';

export const cognate4Lessons = [
  { id: 'cognate4-introduction', title: 'Lesson 1: Introduction to Machine Vision' },
  { id: 'cognate4-introduction-extension', title: 'Lesson 2: Introduction Extension' },
  { id: 'cognate4-working-with-images', title: 'Lesson 3: Working with Images' },
  { id: 'cognate4-bitwise-operations', title: 'Lesson 4: Java Bitwise Operations' },
  { id: 'cognate4-grayscale-methods', title: 'Lesson 5: Grayscale Methods' },
] as const;

const topics: LessonTopic[] = [
  {
    id: 'cognate4-introduction',
    title: 'Introduction to Machine Vision',
    description: 'Digital-image history, image fundamentals, sensing, processing levels, and applications.',
    sections: [
      {
        id: 'history',
        title: 'History of digital image processing',
        summary: 'Image transmission evolved from the Bartlane cable system to computer-enhanced space imagery.',
        bullets: [
          'The early-1920s Bartlane system sent newspaper images between London and New York through submarine cables, cutting delivery from more than a week to under three hours.',
          'By the end of 1921, photographic reproduction replaced the original printing method; perforated tape received at a telegraph terminal improved resolution and tonal quality.',
          'Bartlane initially encoded 5 gray levels and reached 15 levels by 1929. Later systems used coded tape to modulate light beams that exposed film plates.',
          'Digital image processing emerged in the 1960s with powerful computers and space-program needs.',
          'In 1964, JPL corrected TV-camera distortion in Ranger 7 lunar images. The first U.S. spacecraft Moon photograph was taken 17 minutes before impact.',
          'The Ranger work helped lead to image enhancement for Surveyor, Mariner, and Apollo missions.',
        ],
        recallPrompt: 'What two milestones connect Bartlane and Ranger 7?',
        recallAnswer: 'Bartlane enabled rapid cable-picture transmission in the 1920s; JPL digitally corrected Ranger 7 lunar imagery in 1964.',
      },
      {
        id: 'digital-image',
        title: 'What is a digital image?',
        summary: 'An image is a two-dimensional function f(x, y).',
        bullets: [
          'x and y are spatial or plane coordinates.',
          'The amplitude of f at a point is its intensity or gray level.',
          'An image is digital when x, y, and intensity take finite, discrete values.',
        ],
        recallPrompt: 'What do f, x, and y represent in f(x, y)?',
        recallAnswer: 'x and y locate the point; f gives its intensity or gray level.',
      },
      {
        id: 'human-machine-sensing',
        title: 'Human senses versus machines',
        summary: 'Human vision covers visible light, while machine sensors can use a much broader spectrum.',
        bullets: [
          'Visible light spans approximately 400 to 700 nanometers.',
          'Machine sensors can detect electromagnetic waves from radio waves to gamma rays.',
          'Machine imagery can come from ultrasound, MRI, electron microscopy, CGI, and other sources beyond visible light.',
        ],
        recallPrompt: 'What wavelength range is visible to humans?',
        recallAnswer: 'Approximately 400 to 700 nanometers.',
      },
      {
        id: 'vision-paradigm',
        title: 'Computer vision paradigm',
        summary: 'Computer vision progresses from image-to-image operations to features and then interpretation.',
        bullets: [
          'Low-level processing performs noise reduction, contrast enhancement, and sharpening; both input and output are images.',
          'Mid-level processing includes segmentation, feature extraction, and object classification; output is image features such as edges or shapes.',
          'High-level processing interprets image content for object recognition, scene understanding, or decision-making.',
        ],
        recallPrompt: 'How do low-, mid-, and high-level processing outputs differ?',
        recallAnswer: 'Low-level outputs images, mid-level outputs features, and high-level outputs interpretation or decisions.',
      },
      {
        id: 'applications',
        title: 'Applications of machine vision',
        summary: 'Machine vision supports inspection, recognition, medicine, science, and remote sensing.',
        examples: [
          'Manufactured goods, circuit boards, agriculture, and cells under a microscope',
          'Plate numbers, fingerprints, paper currency, and security cameras',
          'Hand X-rays, X-ray inspection, bone scans, and the Cygnus Loop',
          'Crab Pulsar imagery in gamma, X-ray, optical, infrared, and radio bands',
        ],
        recallPrompt: 'Why can the same astronomical object look different across images?',
        recallAnswer: 'Different sensors record different regions of the electromagnetic spectrum.',
      },
    ],
  },
  {
    id: 'cognate4-introduction-extension',
    title: 'Introduction Extension',
    description: 'Human vision, camera digitization, resolution, gray levels, and color depth.',
    sections: [
      {
        id: 'human-vision',
        title: 'How humans see',
        summary: 'The eye focuses light and converts it to signals interpreted by the brain.',
        bullets: [
          'Light enters through the cornea and pupil; the pupil changes size to control the amount of light.',
          'The lens focuses light on the retina, whose light-sensitive cells convert it into electrical signals.',
          'The optic nerve carries the signals to the brain. Pigment cells lie behind the retina.',
          'Rods and cones are retinal receptors; cone types respond to red, green, and blue regions.',
        ],
        recallPrompt: 'What is the path from incoming light to perception?',
        recallAnswer: 'Cornea, pupil, lens, retina, electrical signals, optic nerve, then brain.',
      },
      {
        id: 'perception-effects',
        title: 'Mach bands and simultaneous contrast',
        summary: 'Human perception can exaggerate differences that are not present in the measured intensity.',
        bullets: [
          'The Mach band effect exaggerates contrast near edges between slightly different shades.',
          'In simultaneous contrast, identical inner squares appear progressively darker as their backgrounds become lighter.',
        ],
        recallPrompt: 'What does the Mach band effect exaggerate?',
        recallAnswer: 'The perceived contrast along boundaries between nearby shades.',
      },
      {
        id: 'camera-digitization',
        title: 'How a camera sees',
        summary: 'An imaging system projects an illuminated scene onto an image plane and digitizes the result.',
        bullets: [
          'Sampling converts continuous spatial positions into discrete pixel locations.',
          'Quantization maps continuous intensity values to a finite set of gray levels.',
          'Saturation clips intensities above the highest representable value, creating a high constant-intensity area.',
          'Noise appears as a grainy texture and can mask the lowest detectable true intensity, especially in dark regions.',
        ],
        recallPrompt: 'What is the difference between sampling and quantization?',
        recallAnswer: 'Sampling discretizes position; quantization discretizes intensity.',
      },
      {
        id: 'resolution-depth',
        title: 'Spatial resolution, gray levels, and color depth',
        summary: 'Resolution determines spatial detail, while bit depth determines how many values can represent a pixel or channel.',
        bullets: [
          'Reducing spatial resolution removes detail and increases visible pixelation.',
          'Color depth, or bit depth, is the number of bits used for one pixel or for each component of a pixel.',
          'A b-bit value can represent 2^b levels: 1-bit has 2 levels, 2-bit has 4, 4-bit has 16, and 8-bit has 256.',
          'RGB is an additive color model. Its red, green, and blue channels can each be viewed as grayscale intensity images.',
          'Cyan, magenta, and yellow form a subtractive color model.',
        ],
        recallPrompt: 'How many values can an 8-bit channel represent?',
        recallAnswer: '256 values.',
      },
    ],
  },
  {
    id: 'cognate4-working-with-images',
    title: 'Working with Images',
    description: 'Image coordinates and the Java APIs used to load, inspect, create, and save images.',
    sections: [
      {
        id: 'coordinates',
        title: 'Coordinate system and pixel indices',
        summary: 'Images have their own pixel coordinate system, independent of the drawing surface.',
        bullets: [
          'Pixel indices are discrete coordinates; spatial coordinates are continuous.',
          'The origin is at the upper-left and y increases from top to bottom.',
          'For dimensions M x N, the maximum column is M - 1 and the maximum row is N - 1.',
        ],
        recallPrompt: 'Where is the origin of an image-index coordinate system?',
        recallAnswer: 'At the upper-left corner.',
      },
      {
        id: 'java-classes',
        title: 'Java image classes and loading',
        summary: 'Image represents graphical images; BufferedImage enables direct image-data operations.',
        bullets: [
          'java.awt.Image represents graphical images as rectangular pixel arrays.',
          'java.awt.image.BufferedImage extends Image.',
          'Image I/O supports GIF, PNG, JPEG, BMP, and WBMP.',
          'ImageIO.read(new File("image.jpg")) loads an image and may throw IOException.',
        ],
        recallPrompt: 'Why use BufferedImage instead of only Image?',
        recallAnswer: 'BufferedImage permits direct operations on image data.',
      },
      {
        id: 'pixel-api',
        title: 'Reading and writing pixels',
        summary: 'BufferedImage exposes pixel and dimension methods.',
        bullets: [
          'getRGB(int x, int y) returns an integer pixel in TYPE_INT_ARGB and default sRGB, with 8-bit precision per component.',
          'Color conversion occurs when the image ColorModel differs from the default model.',
          'Out-of-bounds coordinates may throw ArrayIndexOutOfBoundsException; explicit bounds checking is not guaranteed.',
          'setRGB(int x, int y, int rgb) writes a pixel; getWidth() and getHeight() return dimensions.',
        ],
        recallPrompt: 'What does getRGB(x, y) return?',
        recallAnswer: 'An integer pixel in the default TYPE_INT_ARGB model and sRGB color space.',
      },
      {
        id: 'create-save',
        title: 'Creating and saving images',
        summary: 'BufferedImage can be constructed manually and saved through ImageIO.',
        bullets: [
          'new BufferedImage(width, height, type) creates an image using a predefined type.',
          'ImageIO.write(RenderedImage im, String formatName, File output) returns boolean and throws IOException.',
          'For PNG output, pass "png" and a File such as saved.png.',
        ],
        recallPrompt: 'Which call saves a BufferedImage named bi as PNG?',
        recallAnswer: 'ImageIO.write(bi, "png", outputfile).',
      },
    ],
  },
  {
    id: 'cognate4-bitwise-operations',
    title: 'Java Bitwise Operations',
    description: 'Integer operators that manipulate individual bits.',
    sections: [
      {
        id: 'bitwise-overview',
        title: 'Bitwise fundamentals',
        summary: 'Bitwise operations work at bit level on Java integer types.',
        bullets: [
          'They are useful for low-level programming, bit manipulation, and encryption.',
          'They work with byte, short, int, and long.',
          'The operators are AND &, OR |, XOR ^, complement ~, left shift <<, signed right shift >>, and unsigned right shift >>>.',
        ],
        recallPrompt: 'Which Java primitive families accept bitwise operations?',
        recallAnswer: 'The integer types byte, short, int, and long.',
      },
      {
        id: 'logic-operators',
        title: 'AND, OR, XOR, and complement',
        summary: 'Each operator applies a different truth rule to individual bits.',
        examples: [
          '5 & 7: 0101 & 0111 = 0101, or 5',
          '5 | 7: 0101 | 0111 = 0111, or 7',
          '5 ^ 7: 0101 ^ 0111 = 0010, or 2',
          '~5 = -6 in Java two\'s-complement representation',
        ],
        recallPrompt: 'What does XOR keep?',
        recallAnswer: 'Bits that differ between the two inputs.',
      },
      {
        id: 'shifts',
        title: 'Bit-shift operations',
        summary: 'Shift operators move the bit pattern left or right.',
        bullets: [
          'A one-position left shift multiplies by 2 when overflow is not involved.',
          'A one-position right shift divides by 2 for the positive examples used in the lesson.',
          '>> is signed right shift, >>> is unsigned right shift, and << is left shift.',
        ],
        recallPrompt: 'How do >> and >>> differ?',
        recallAnswer: '>> is signed right shift; >>> is unsigned right shift.',
      },
    ],
  },
  {
    id: 'cognate4-grayscale-methods',
    title: 'Grayscale Methods',
    description: 'Intensity-only images and three RGB-to-grayscale formulas.',
    sections: [
      {
        id: 'grayscale-basics',
        title: 'What is a grayscale image?',
        summary: 'Each grayscale pixel is one sample describing light intensity, without hue.',
        bullets: [
          'A color image can be separated into red, green, and blue channels.',
          'Each individual channel is displayed as a grayscale intensity image.',
        ],
        recallPrompt: 'What information does a grayscale pixel carry?',
        recallAnswer: 'Intensity only, with no hue.',
      },
      {
        id: 'conversion-methods',
        title: 'Average, lightness, and luminosity',
        summary: 'The three methods combine RGB values differently.',
        bullets: [
          'Average: (R + G + B) / 3.',
          'Lightness: (max(R, G, B) + min(R, G, B)) / 2.',
          'Luminosity: 0.21R + 0.72G + 0.07B.',
          'Luminosity weights green most heavily, then red, then blue.',
        ],
        recallPrompt: 'Which method gives green a weight of 0.72?',
        recallAnswer: 'The luminosity or weighted method.',
      },
    ],
  },
];

export const cognate4Subject: SubjectManifest = {
  id: 'cognate4',
  code: 'COGNATE4',
  title: 'Machine Vision',
  description: 'Machine vision foundations, Java image processing, and grayscale conversion.',
  topics,
  mccumber: { goals: [], states: [], safeguards: [] },
  reviewModes: ['study', 'test', 'crossword'],
};
