// Original practice prompts based on the six supplied Cognate 3 lesson PDFs.
export interface JeopardyClue { id: string; prompt: string; answer: string; explanation: string; source: string; pages: string; value: number; category: string; round: number; }
export interface JeopardyCategory { id: number; name: string; label: string; rounds: JeopardyClue[][]; }
export const jeopardySources: Record<string, { title: string; file: string }> = {
  "images": {
    "title": "Working with Images",
    "file": "Copy of Lesson 3_ Working with Images.pptx.pdf"
  },
  "bits": {
    "title": "Java Bitwise Operations",
    "file": "Java Bitwise Operations.pdf"
  },
  "gray": {
    "title": "Grayscale Methods",
    "file": "Copy of Lession 5_  Grayscale.pdf"
  },
  "hist": {
    "title": "Image Histogram",
    "file": "Histogram.pdf"
  },
  "equal": {
    "title": "Histogram Equalization",
    "file": "Copy of Histogram.pdf"
  },
  "spatial": {
    "title": "Spatial Filtering Part I",
    "file": "Copy-of-Lession-9_-Spatial-Filtering.pdf"
  }
};
export const jeopardyCategories: JeopardyCategory[] = [
  {
    "id": 0,
    "name": "Working with images",
    "label": "THE PIXEL",
    "rounds": [
      [
        {
          "id": "r0-c0-v0",
          "prompt": "In the image coordinate system from the lesson, this corner contains the origin (0, 0).",
          "answer": "What is the upper-left corner?",
          "explanation": "The x-coordinate increases to the right; the y-coordinate increases downward.",
          "source": "images",
          "pages": "6",
          "value": 100,
          "category": "Working with images",
          "round": 0
        },
        {
          "id": "r0-c0-v1",
          "prompt": "This Java class extends Image and lets an application work directly with image data.",
          "answer": "What is BufferedImage?",
          "explanation": "java.awt.image.BufferedImage extends java.awt.Image.",
          "source": "images",
          "pages": "9",
          "value": 200,
          "category": "Working with images",
          "round": 0
        },
        {
          "id": "r0-c0-v2",
          "prompt": "These two BufferedImage methods read a pixel value and change a pixel value, respectively.",
          "answer": "What are getRGB(x, y) and setRGB(x, y, rgb)?",
          "explanation": "getRGB returns an integer color value; setRGB writes a specified value at the coordinates.",
          "source": "images",
          "pages": "14, 16",
          "value": 300,
          "category": "Working with images",
          "round": 0
        },
        {
          "id": "r0-c0-v3",
          "prompt": "An image is 640 pixels wide and 480 pixels high. Give its bottom-right pixel coordinates using zero-based indexing.",
          "answer": "What is (639, 479)?",
          "explanation": "The last x-coordinate is width − 1; the last y-coordinate is height − 1.",
          "source": "images",
          "pages": "6–7",
          "value": 400,
          "category": "Working with images",
          "round": 0
        },
        {
          "id": "r0-c0-v4",
          "prompt": "Complete the Java call that saves BufferedImage bi to a PNG file named saved.png.",
          "answer": "What is ImageIO.write(bi, \"png\", new File(\"saved.png\"))?",
          "explanation": "The parameters are the image, format name, and output File. The call can throw IOException.",
          "source": "images",
          "pages": "22–23",
          "value": 500,
          "category": "Working with images",
          "round": 0
        }
      ],
      [
        {
          "id": "r1-c0-v0",
          "prompt": "Image width and height are measured in these discrete picture elements.",
          "answer": "What are pixels?",
          "explanation": "The lesson distinguishes discrete pixel indices from continuous spatial coordinates.",
          "source": "images",
          "pages": "4",
          "value": 100,
          "category": "Working with images",
          "round": 1
        },
        {
          "id": "r1-c0-v1",
          "prompt": "Name the ImageIO method used to load a file into a BufferedImage.",
          "answer": "What is ImageIO.read(new File(\"image.jpg\"))?",
          "explanation": "The lesson assigns the result of ImageIO.read to a BufferedImage and handles IOException.",
          "source": "images",
          "pages": "11–12",
          "value": 200,
          "category": "Working with images",
          "round": 1
        },
        {
          "id": "r1-c0-v2",
          "prompt": "A pixel is at (4, 2). You move three columns right and one row down. Give the new coordinates.",
          "answer": "What is (7, 3)?",
          "explanation": "Moving right adds to x; moving down adds to y in this image coordinate system.",
          "source": "images",
          "pages": "6–7",
          "value": 300,
          "category": "Working with images",
          "round": 1
        },
        {
          "id": "r1-c0-v3",
          "prompt": "Give the BufferedImage constructor pattern used to create an image, then the two methods used to get its dimensions.",
          "answer": "What are new BufferedImage(width, height, type), getWidth(), and getHeight()?",
          "explanation": "The constructor specifies dimensions and a predefined image type; the methods return its width and height.",
          "source": "images",
          "pages": "18, 20",
          "value": 400,
          "category": "Working with images",
          "round": 1
        },
        {
          "id": "r1-c0-v4",
          "prompt": "getRGB(x, y) returns an integer in this default color model, with this many bits of precision per color component.",
          "answer": "What are TYPE_INT_ARGB and 8 bits per component?",
          "explanation": "The slide specifies the default RGB model TYPE_INT_ARGB and default sRGB colorspace. Color conversion can occur.",
          "source": "images",
          "pages": "14",
          "value": 500,
          "category": "Working with images",
          "round": 1
        }
      ]
    ]
  },
  {
    "id": 1,
    "name": "Bit by bit",
    "label": "JAVA BITS",
    "rounds": [
      [
        {
          "id": "r0-c1-v0",
          "prompt": "This bitwise operator keeps a 1 only when both corresponding input bits are 1. Give its name and symbol.",
          "answer": "What is AND (&)?",
          "explanation": "AND keeps the common 1 bits. It is a binary operation.",
          "source": "bits",
          "pages": "5",
          "value": 100,
          "category": "Bit by bit",
          "round": 0
        },
        {
          "id": "r0-c1-v1",
          "prompt": "Evaluate 12 | 5 in decimal. Binary: 1100 | 0101.",
          "answer": "What is 13?",
          "explanation": "OR keeps any 1: 1100 | 0101 = 1101, which is decimal 13.",
          "source": "bits",
          "pages": "7",
          "value": 200,
          "category": "Bit by bit",
          "round": 0
        },
        {
          "id": "r0-c1-v2",
          "prompt": "Evaluate 12 ^ 5 in decimal. Binary: 1100 ^ 0101.",
          "answer": "What is 9?",
          "explanation": "XOR keeps different bits: 1100 ^ 0101 = 1001, which is decimal 9.",
          "source": "bits",
          "pages": "9",
          "value": 300,
          "category": "Bit by bit",
          "round": 0
        },
        {
          "id": "r0-c1-v3",
          "prompt": "Evaluate (12 & 10) << 1 in decimal. Binary inputs: 1100 and 1010.",
          "answer": "What is 16?",
          "explanation": "First 1100 & 1010 = 1000 (8). Shifting left once gives 10000 (16). These positive values do not overflow.",
          "source": "bits",
          "pages": "5, 13",
          "value": 400,
          "category": "Bit by bit",
          "round": 0
        },
        {
          "id": "r0-c1-v4",
          "prompt": "For a Java int, what does ~5 evaluate to?",
          "answer": "What is −6?",
          "explanation": "Complement flips every bit of the 32-bit int. With two’s-complement representation, ~n = −n − 1. It is not just a flip of the visible three bits in 101.",
          "source": "bits",
          "pages": "10–11",
          "value": 500,
          "category": "Bit by bit",
          "round": 0
        }
      ],
      [
        {
          "id": "r1-c1-v0",
          "prompt": "This bitwise operator keeps a 1 when either input bit is 1, including when both are 1.",
          "answer": "What is OR (|)?",
          "explanation": "OR produces 0 only when both input bits are 0.",
          "source": "bits",
          "pages": "7",
          "value": 100,
          "category": "Bit by bit",
          "round": 1
        },
        {
          "id": "r1-c1-v1",
          "prompt": "Evaluate 14 & 11 in decimal. Binary: 1110 & 1011.",
          "answer": "What is 10?",
          "explanation": "Keep only common 1s: 1110 & 1011 = 1010, which is decimal 10.",
          "source": "bits",
          "pages": "5",
          "value": 200,
          "category": "Bit by bit",
          "round": 1
        },
        {
          "id": "r1-c1-v2",
          "prompt": "Evaluate 9 ^ 9 and name the rule behind the result.",
          "answer": "What is 0, because identical bits cancel under XOR?",
          "explanation": "Each pair is either 0 ^ 0 or 1 ^ 1, and both produce 0.",
          "source": "bits",
          "pages": "9",
          "value": 300,
          "category": "Bit by bit",
          "round": 1
        },
        {
          "id": "r1-c1-v3",
          "prompt": "For positive int values with no overflow, evaluate 7 << 2 and 28 >> 2.",
          "answer": "What are 28 and 7?",
          "explanation": "Two left shifts multiply 7 by 4; two signed right shifts divide positive 28 by 4. The slide’s multiply/divide shortcut needs care with negatives and overflow.",
          "source": "bits",
          "pages": "13",
          "value": 400,
          "category": "Bit by bit",
          "round": 1
        },
        {
          "id": "r1-c1-v4",
          "prompt": "Name Java’s signed right shift, unsigned right shift, and left shift symbols, in that order.",
          "answer": "What are >>, >>>, and <<?",
          "explanation": "Signed right shift propagates the sign bit. Unsigned right shift fills from the left with zeros. Left shift moves bits left and fills low positions with zeros.",
          "source": "bits",
          "pages": "13",
          "value": 500,
          "category": "Bit by bit",
          "round": 1
        }
      ]
    ]
  },
  {
    "id": 2,
    "name": "Going grayscale",
    "label": "LIGHT & TONE",
    "rounds": [
      [
        {
          "id": "r0-c2-v0",
          "prompt": "A grayscale pixel carries intensity information but none of this color attribute.",
          "answer": "What is hue?",
          "explanation": "The lesson describes one sample representing an amount of light: only values, no hue.",
          "source": "gray",
          "pages": "3",
          "value": 100,
          "category": "Going grayscale",
          "round": 0
        },
        {
          "id": "r0-c2-v1",
          "prompt": "Name the grayscale method that uses (R + G + B) / 3.",
          "answer": "What is the average method?",
          "explanation": "The three channels contribute equally.",
          "source": "gray",
          "pages": "7",
          "value": 200,
          "category": "Going grayscale",
          "round": 0
        },
        {
          "id": "r0-c2-v2",
          "prompt": "Use the average method for RGB (90, 150, 210).",
          "answer": "What is 150?",
          "explanation": "(90 + 150 + 210) / 3 = 450 / 3 = 150.",
          "source": "gray",
          "pages": "7",
          "value": 300,
          "category": "Going grayscale",
          "round": 0
        },
        {
          "id": "r0-c2-v3",
          "prompt": "Use the lightness method for RGB (40, 100, 220).",
          "answer": "What is 130?",
          "explanation": "Lightness = (maximum + minimum) / 2 = (220 + 40) / 2 = 130. The middle channel is not used.",
          "source": "gray",
          "pages": "9",
          "value": 400,
          "category": "Going grayscale",
          "round": 0
        },
        {
          "id": "r0-c2-v4",
          "prompt": "Use the lesson’s luminosity weights for RGB (100, 150, 200). Give the unrounded value.",
          "answer": "What is 143?",
          "explanation": "0.21(100) + 0.72(150) + 0.07(200) = 21 + 108 + 14 = 143. Use the supplied coefficients.",
          "source": "gray",
          "pages": "11",
          "value": 500,
          "category": "Going grayscale",
          "round": 0
        }
      ],
      [
        {
          "id": "r1-c2-v0",
          "prompt": "These three color channels can each be represented as a grayscale image in the lesson’s channel-splitting example.",
          "answer": "What are red, green, and blue?",
          "explanation": "A single channel’s intensity can be displayed as grayscale. This differs from combining all three channels into a grayscale value.",
          "source": "gray",
          "pages": "5",
          "value": 100,
          "category": "Going grayscale",
          "round": 1
        },
        {
          "id": "r1-c2-v1",
          "prompt": "Which color channel receives the highest weight in the lesson’s luminosity method, and what is its coefficient?",
          "answer": "What are green and 0.72?",
          "explanation": "The lesson uses 0.21R + 0.72G + 0.07B; green has the largest coefficient.",
          "source": "gray",
          "pages": "11",
          "value": 200,
          "category": "Going grayscale",
          "round": 1
        },
        {
          "id": "r1-c2-v2",
          "prompt": "Use the lightness method for RGB (20, 80, 200).",
          "answer": "What is 110?",
          "explanation": "(max + min) / 2 = (200 + 20) / 2 = 110.",
          "source": "gray",
          "pages": "9",
          "value": 300,
          "category": "Going grayscale",
          "round": 1
        },
        {
          "id": "r1-c2-v3",
          "prompt": "For RGB (100, 0, 0), give the average, lightness, and luminosity results, before rounding.",
          "answer": "What are 33⅓, 50, and 21?",
          "explanation": "Average = 100/3; lightness = (100 + 0)/2; luminosity = 0.21(100). Different methods need not produce the same intensity.",
          "source": "gray",
          "pages": "7, 9, 11",
          "value": 400,
          "category": "Going grayscale",
          "round": 1
        },
        {
          "id": "r1-c2-v4",
          "prompt": "For RGB (80, 80, 80), calculate all three grayscale results and explain why they match.",
          "answer": "What is 80 for all three methods?",
          "explanation": "Average = 240/3 = 80; lightness = (80+80)/2 = 80. Luminosity = (0.21+0.72+0.07)×80 = 80 because the weights sum to 1.",
          "source": "gray",
          "pages": "7, 9, 11",
          "value": 500,
          "category": "Going grayscale",
          "round": 1
        }
      ]
    ]
  },
  {
    "id": 3,
    "name": "Read the histogram",
    "label": "THE DISTRIBUTION",
    "rounds": [
      [
        {
          "id": "r0-c3-v0",
          "prompt": "In an image histogram, the horizontal axis shows these values.",
          "answer": "What are gray-level intensities?",
          "explanation": "The x-axis gives intensity values; the y-axis counts how often they occur.",
          "source": "hist",
          "pages": "5",
          "value": 100,
          "category": "Read the histogram",
          "round": 0
        },
        {
          "id": "r0-c3-v1",
          "prompt": "An image histogram’s vertical axis measures this quantity.",
          "answer": "What is the frequency or count of pixels at each intensity?",
          "explanation": "A taller bar means more pixels have that intensity, not that those pixels are necessarily brighter.",
          "source": "hist",
          "pages": "4–5",
          "value": 200,
          "category": "Read the histogram",
          "round": 0
        },
        {
          "id": "r0-c3-v2",
          "prompt": "This information about pixel locations is lost in a histogram, so the original image cannot be uniquely reconstructed.",
          "answer": "What is the spatial arrangement of pixels?",
          "explanation": "A histogram keeps tonal counts, not pixel positions. Different arrangements can have identical histograms.",
          "source": "hist",
          "pages": "5, 9–11",
          "value": 300,
          "category": "Read the histogram",
          "round": 0
        },
        {
          "id": "r0-c3-v3",
          "prompt": "An image contains [0, 0, 85, 85, 85, 255]. Give the nonzero histogram counts.",
          "answer": "What are H(0)=2, H(85)=3, and H(255)=1?",
          "explanation": "Count each distinct intensity. The histogram counts sum to the six pixels in the image.",
          "source": "hist",
          "pages": "5, 7–8",
          "value": 400,
          "category": "Read the histogram",
          "round": 0
        },
        {
          "id": "r0-c3-v4",
          "prompt": "Two 2×2 images are [0,255; 0,255] and [0,0; 255,255]. Do they have the same histogram? Explain.",
          "answer": "What is yes: both contain two 0s and two 255s?",
          "explanation": "One arrangement is vertical and the other is horizontal, but the intensity frequencies match exactly. A histogram cannot distinguish those positions.",
          "source": "hist",
          "pages": "5, 9–11",
          "value": 500,
          "category": "Read the histogram",
          "round": 0
        }
      ],
      [
        {
          "id": "r1-c3-v0",
          "prompt": "An image histogram provides this kind of information about an image in a compact form.",
          "answer": "What is statistical information about intensity distribution?",
          "explanation": "It summarizes the frequency of gray levels, rather than the image’s spatial structure.",
          "source": "hist",
          "pages": "5",
          "value": 100,
          "category": "Read the histogram",
          "round": 1
        },
        {
          "id": "r1-c3-v1",
          "prompt": "In the lesson’s exposure examples, a histogram concentrated toward the dark, left side suggests this exposure condition.",
          "answer": "What is underexposure?",
          "explanation": "The exposure slide compares underexposed, properly exposed, and overexposed images. Dark intensities appear toward the left.",
          "source": "hist",
          "pages": "16",
          "value": 200,
          "category": "Read the histogram",
          "round": 1
        },
        {
          "id": "r1-c3-v2",
          "prompt": "An image has 25 pixels. Its histogram has counts 5 at intensity 0 and 8 at intensity 128. All remaining pixels are 255. Find H(255).",
          "answer": "What is 12?",
          "explanation": "The histogram must account for all pixels: 25 − 5 − 8 = 12.",
          "source": "hist",
          "pages": "5, 7–8",
          "value": 300,
          "category": "Read the histogram",
          "round": 1
        },
        {
          "id": "r1-c3-v3",
          "prompt": "Every pixel increases by 10 and none reaches the maximum allowed value. In which direction does the histogram shift?",
          "answer": "What is 10 intensity levels to the right?",
          "explanation": "Each count moves from intensity i to i+10. The grayscale-intensity slide illustrates darker and brighter versions. No clipping is assumed.",
          "source": "hist",
          "pages": "14",
          "value": 400,
          "category": "Read the histogram",
          "round": 1
        },
        {
          "id": "r1-c3-v4",
          "prompt": "An image uses intensities 20, 20, 70, 100, 100, 220. Give its number of distinct levels and its max-minus-min contrast.",
          "answer": "What are 4 distinct levels and a contrast of 200?",
          "explanation": "The distinct values are 20, 70, 100, 220. Contrast in this lesson is 220 − 20 = 200. Slide 17 calls the number of distinct values “dynamic range”; that is the lesson’s wording.",
          "source": "hist",
          "pages": "17–18",
          "value": 500,
          "category": "Read the histogram",
          "round": 1
        }
      ]
    ]
  },
  {
    "id": 4,
    "name": "Contrast & equalize",
    "label": "MAKE IT CLEAR",
    "rounds": [
      [
        {
          "id": "r0-c4-v0",
          "prompt": "The lesson defines this as the difference between an image’s maximum and minimum pixel values.",
          "answer": "What is contrast?",
          "explanation": "For these clues, use the slide’s numerical definition: maximum intensity minus minimum intensity.",
          "source": "equal",
          "pages": "8",
          "value": 100,
          "category": "Contrast & equalize",
          "round": 0
        },
        {
          "id": "r0-c4-v1",
          "prompt": "Name the technique that expands an image’s intensity range using its minimum and maximum values.",
          "answer": "What is histogram stretching or contrast stretching?",
          "explanation": "The slide maps (f − fmin)/(fmax − fmin) to the available output range.",
          "source": "hist",
          "pages": "20",
          "value": 200,
          "category": "Contrast & equalize",
          "round": 0
        },
        {
          "id": "r0-c4-v2",
          "prompt": "An image has a minimum intensity of 35 and a maximum of 195. Calculate its contrast using the lesson’s definition.",
          "answer": "What is 160?",
          "explanation": "Contrast = 195 − 35 = 160.",
          "source": "hist",
          "pages": "18",
          "value": 300,
          "category": "Contrast & equalize",
          "round": 0
        },
        {
          "id": "r0-c4-v3",
          "prompt": "Name the two primary probability functions calculated during histogram equalization, in order.",
          "answer": "What are PMF, then CDF?",
          "explanation": "First compute the probability mass function from intensity counts, then its cumulative distribution function.",
          "source": "equal",
          "pages": "18",
          "value": 400,
          "category": "Contrast & equalize",
          "round": 0
        },
        {
          "id": "r0-c4-v4",
          "prompt": "Stretch an 8-bit image with fmin=50 and fmax=150. What output intensity does f=100 map to before rounding?",
          "answer": "What is 127.5?",
          "explanation": "g = (100 − 50)/(150 − 50) × 255 = 0.5 × 255 = 127.5. A stored integer depends on the chosen rounding rule.",
          "source": "hist",
          "pages": "20",
          "value": 500,
          "category": "Contrast & equalize",
          "round": 0
        }
      ],
      [
        {
          "id": "r1-c4-v0",
          "prompt": "True or false: the lesson guarantees histogram equalization always improves an image’s contrast.",
          "answer": "What is false?",
          "explanation": "The slides explicitly say equalization may make some images worse; it does not guarantee improvement.",
          "source": "equal",
          "pages": "12",
          "value": 100,
          "category": "Contrast & equalize",
          "round": 1
        },
        {
          "id": "r1-c4-v1",
          "prompt": "An image’s intensities are crowded into a narrow band near the middle. Does this suggest high or low contrast?",
          "answer": "What is low contrast?",
          "explanation": "A narrow used intensity range means a small difference between the darkest and brightest pixels.",
          "source": "equal",
          "pages": "8, 10",
          "value": 200,
          "category": "Contrast & equalize",
          "round": 1
        },
        {
          "id": "r1-c4-v2",
          "prompt": "An intensity occurs 6 times in an image of 16 pixels. Calculate its PMF value.",
          "answer": "What is 6/16 = 0.375?",
          "explanation": "PMF at an intensity is its count divided by the total number of pixels.",
          "source": "equal",
          "pages": "18–19",
          "value": 300,
          "category": "Contrast & equalize",
          "round": 1
        },
        {
          "id": "r1-c4-v3",
          "prompt": "The lowest three gray levels have PMFs 0.2, 0.3, and 0.1. Find the CDF at the third level.",
          "answer": "What is 0.6?",
          "explanation": "The cumulative distribution adds all probabilities through the current level: 0.2 + 0.3 + 0.1.",
          "source": "equal",
          "pages": "18–19",
          "value": 400,
          "category": "Contrast & equalize",
          "round": 1
        },
        {
          "id": "r1-c4-v4",
          "prompt": "Use the slide’s direct equalization mapping q=255×CDF. If the cumulative count is 9 out of 16 pixels, find q before rounding.",
          "answer": "What is 143.4375?",
          "explanation": "CDF = 9/16, so q = 255×9/16 = 143.4375. The slide’s table lists 143 for this entry. This question uses direct CDF scaling, without CDF-min subtraction.",
          "source": "equal",
          "pages": "19",
          "value": 500,
          "category": "Contrast & equalize",
          "round": 1
        }
      ]
    ]
  },
  {
    "id": 5,
    "name": "Spatial filters",
    "label": "THE NEIGHBORHOOD",
    "rounds": [
      [
        {
          "id": "r0-c5-v0",
          "prompt": "Give one of the common names for the small subimage of coefficients used in spatial filtering.",
          "answer": "What is a filter, mask, or kernel?",
          "explanation": "The lesson also lists template and window. The values inside are called coefficients.",
          "source": "spatial",
          "pages": "3",
          "value": 100,
          "category": "Spatial filters",
          "round": 0
        },
        {
          "id": "r0-c5-v1",
          "prompt": "This nonlinear filter is particularly effective at removing salt-and-pepper noise.",
          "answer": "What is the median filter?",
          "explanation": "Median filtering removes isolated extreme values by using an ordered neighborhood’s middle value.",
          "source": "spatial",
          "pages": "17",
          "value": 200,
          "category": "Spatial filters",
          "round": 0
        },
        {
          "id": "r0-c5-v2",
          "prompt": "This filter blurs with a kernel shaped like a bell-shaped hump.",
          "answer": "What is the Gaussian filter?",
          "explanation": "The Gaussian filter removes detail and noise, using a different weighting pattern from a uniform mean filter.",
          "source": "spatial",
          "pages": "15",
          "value": 300,
          "category": "Spatial filters",
          "round": 0
        },
        {
          "id": "r0-c5-v3",
          "prompt": "A uniform 3×3 mean filter covers [10,20,30; 40,50,60; 70,80,90]. Calculate the output.",
          "answer": "What is 50?",
          "explanation": "The nine values sum to 450. A normalized 3×3 mean kernel multiplies the sum by 1/9: 450/9 = 50.",
          "source": "spatial",
          "pages": "7, 13",
          "value": 400,
          "category": "Spatial filters",
          "round": 0
        },
        {
          "id": "r0-c5-v4",
          "prompt": "Conservative smoothing sees center=250 and neighboring values ranging from 20 to 80. What does it output, and why?",
          "answer": "What is 80, because the center exceeds the neighborhood maximum?",
          "explanation": "The pseudocode clips an outlying center to the nearest neighborhood extreme. A center below 20 becomes 20; one already in [20,80] stays unchanged.",
          "source": "spatial",
          "pages": "19–20",
          "value": 500,
          "category": "Spatial filters",
          "round": 0
        }
      ],
      [
        {
          "id": "r1-c5-v0",
          "prompt": "Name any two applications of spatial filtering listed in the lesson.",
          "answer": "What are any two of sharpening, edge detection, blurring, and noise reduction?",
          "explanation": "All four are listed on the introductory slide.",
          "source": "spatial",
          "pages": "2",
          "value": 100,
          "category": "Spatial filters",
          "round": 1
        },
        {
          "id": "r1-c5-v1",
          "prompt": "The values inside a filter mask are called this, rather than pixels.",
          "answer": "What are coefficients?",
          "explanation": "The coefficients control how neighboring image pixels contribute to the output.",
          "source": "spatial",
          "pages": "3",
          "value": 200,
          "category": "Spatial filters",
          "round": 1
        },
        {
          "id": "r1-c5-v2",
          "prompt": "What is the median of [0,10,10,10,20,20,20,30,255]?",
          "answer": "What is 20?",
          "explanation": "There are nine sorted values, so take the fifth one. The extreme values 0 and 255 do not control the median.",
          "source": "spatial",
          "pages": "17",
          "value": 300,
          "category": "Spatial filters",
          "round": 1
        },
        {
          "id": "r1-c5-v3",
          "prompt": "A 3×3 weighted mask is [1,2,1; 2,4,2; 1,2,1]. By what sum should its weighted output be divided to form an average?",
          "answer": "What is 16?",
          "explanation": "The coefficients sum to 1+2+1+2+4+2+1+2+1 = 16. The lesson shows the normalized mask with a 1/16 multiplier.",
          "source": "spatial",
          "pages": "7–8",
          "value": 400,
          "category": "Spatial filters",
          "round": 1
        },
        {
          "id": "r1-c5-v4",
          "prompt": "For conservative smoothing, neighbors range from 15 to 90. Give the outputs for centers 5, 60, and 120, respectively.",
          "answer": "What are 15, 60, and 90?",
          "explanation": "5 is below the minimum and becomes 15; 60 lies inside the range and stays 60; 120 exceeds the maximum and becomes 90. The center is excluded when finding the neighboring extremes.",
          "source": "spatial",
          "pages": "19–20",
          "value": 500,
          "category": "Spatial filters",
          "round": 1
        }
      ]
    ]
  }
];
export const jeopardyClues = jeopardyCategories.flatMap(category => category.rounds.flat());
export const finalJeopardyClue: JeopardyClue = {
  "id": "final",
  "prompt": "A grayscale 2×2 image is [0,0; 100,200]. First find H(0), then PMF(0), then CDF(100). Finally use the slide’s direct equalization rule q=255×CDF to map intensity 100, before rounding.",
  "answer": "What are 2, 0.5, 0.75, and 191.25?",
  "explanation": "Two of the four pixels are 0, so H(0)=2 and PMF(0)=2/4=0.5. Three pixels have intensity ≤100, so CDF(100)=3/4=0.75. The mapped value is 255×0.75=191.25. This follows the supplied direct-CDF convention.",
  "source": "equal",
  "pages": "18–19",
  "value": 0,
  "category": "Final Jeopardy",
  "round": 2
};
