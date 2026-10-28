// Definition-to-term recall based on the six supplied Cognate 3 lesson PDFs.
export interface JeopardyClue { id: string; prompt: string; answer: string; explanation: string; source: string; pages: string; value: number; category: string; round: number; }
export interface JeopardyCategory { id: number; name: string; label: string; rounds: JeopardyClue[][]; }
export const jeopardySources: Record<string, { title: string; file: string }> = {
  images: { title: 'Working with Images', file: 'Copy of Lesson 3_ Working with Images.pptx.pdf' },
  bits: { title: 'Java Bitwise Operations', file: 'Java Bitwise Operations.pdf' },
  gray: { title: 'Grayscale Methods', file: 'Copy of Lession 5_  Grayscale.pdf' },
  hist: { title: 'Image Histogram', file: 'Histogram.pdf' },
  equal: { title: 'Histogram Equalization', file: 'Copy of Histogram.pdf' },
  spatial: { title: 'Spatial Filtering Part I', file: 'Copy-of-Lession-9_-Spatial-Filtering.pdf' },
};
type Definition = [definition: string, term: string, explanation: string, source: string, pages: string];
function category(id: number, name: string, label: string, rounds: Definition[][]): JeopardyCategory {
  return { id, name, label, rounds: rounds.map((round, r) => round.map(([prompt, answer, explanation, source, pages], v) => ({ id: `r${r}-c${id}-v${v}`, prompt, answer, explanation, source, pages, value: (v + 1) * 100, category: name, round: r }))) };
}
// The second board revisits the same lesson vocabulary with different definitions.
// A clue always asks for a term, never a calculation, code fragment, or operator symbol.
export const jeopardyCategories: JeopardyCategory[] = [
  category(0, 'Working with images', 'IMAGE FOUNDATIONS', [[
    ['The corner of an image where the coordinate system begins.', 'Upper-left corner', 'The lesson places the image origin in the upper-left corner. The vertical direction runs downward.', 'images', '6'],
    ['A Java image class that allows an application to work directly with image data.', 'BufferedImage', 'BufferedImage extends the Image class and provides direct access to image data.', 'images', '9'],
    ['The Java superclass that represents graphical images as rectangular arrays of pixels.', 'Image class', 'The Image class is the superclass; BufferedImage extends it.', 'images', '9'],
    ['The Java API used to load and save images in supported file formats.', 'Image I/O API', 'The lesson uses Image I/O for both reading external image files and writing images to files.', 'images', '11–12, 22–23'],
    ['Discrete coordinates that identify individual locations in an image array.', 'Pixel indices', 'Pixel indices describe individual pixel positions. The lesson distinguishes them from continuous spatial coordinates.', 'images', '4'],
  ], [
    ['A system for describing positions within an image, independently of the drawing surface.', 'Image coordinate system', 'An image has its own coordinate system as well as a width and height measured in pixels.', 'images', '4'],
    ['Continuous coordinates used to describe positions in image space.', 'Spatial coordinates', 'Spatial coordinates are continuous; pixel indices are discrete.', 'images', '4'],
    ['The horizontal dimension of an image, measured in pixels.', 'Image width', 'Width describes the horizontal extent of an image.', 'images', '4, 18'],
    ['The vertical dimension of an image, measured in pixels.', 'Image height', 'Height describes the vertical extent of an image.', 'images', '4, 18'],
    ['File representations used to store images, including PNG, JPEG, GIF, and BMP.', 'Image file formats', 'The lesson lists these formats among those supported by the Java Image I/O API.', 'images', '11'],
  ]]),
  category(1, 'Image concepts', 'KNOW THE TERMS', [[
    ['An individual picture element in a digital image.', 'Pixel', 'Images are described by their dimensions in pixels, and each pixel can carry image data.', 'images', '4, 9'],
    ['The amount of light represented by a grayscale pixel.', 'Intensity', 'The grayscale lesson describes each pixel as a sample carrying only intensity information.', 'gray', '3'],
    ['The three color components red, green, and blue considered together.', 'RGB', 'The lesson shows a color image separated into its red, green, and blue components.', 'gray', '5'],
    ['The color attribute that is absent from a grayscale image, which retains only intensity.', 'Hue', 'The lesson describes grayscale as having values but no hue.', 'gray', '3'],
    ['The positions of pixels within an image, which a histogram does not preserve.', 'Spatial arrangement', 'A histogram records intensity frequencies rather than where individual pixels are located.', 'hist', '5'],
  ], [
    ['The width and height that describe the size of an image.', 'Image dimensions', 'The working-with-images lesson describes image size through its width and height, measured in pixels.', 'images', '4'],
    ['Operations that manipulate integer data at the level of individual bits.', 'Bitwise operations', 'The lesson defines these as bit-level operations used in low-level programming and bit manipulation.', 'bits', '3'],
    ['A single component of a multichannel image, such as its red, green, or blue component.', 'Color channel', 'An individual color channel can be displayed as a grayscale image.', 'gray', '4–5'],
    ['An image representation that combines red, green, and blue components.', 'RGB color image', 'The channel illustration begins with a color image and separates it into three component images.', 'gray', '5'],
    ['A representation of an image as rows and columns of picture elements.', 'Pixel array', 'The lesson describes graphical images as rectangular arrays of pixels.', 'images', '9'],
  ]]),
  category(2, 'Going grayscale', 'METHODS & MEANING', [[
    ['An image whose pixels carry intensity information without hue.', 'Grayscale image', 'A grayscale pixel represents an amount of light rather than a color hue.', 'gray', '3'],
    ['A grayscale conversion method that gives equal importance to the red, green, and blue channels.', 'Average method', 'This method uses all three channel values equally to obtain one gray level.', 'gray', '7'],
    ['A grayscale conversion method that uses only the brightest and darkest RGB channel values.', 'Lightness method', 'This method combines the maximum and minimum channel values, leaving out the middle value.', 'gray', '9'],
    ['A grayscale conversion method that gives green the greatest importance and blue the least.', 'Luminosity method / weighted method', 'The lesson assigns different weights to the channels, with green contributing the most.', 'gray', '11'],
    ['A grayscale view that displays the intensity of just one component of a color image.', 'Single-channel grayscale image', 'The lesson demonstrates grayscale views of separate red, green, and blue channels.', 'gray', '4–5'],
  ], [
    ['A conversion technique that treats all three RGB components equally when producing a gray level.', 'Average method', 'Equal contribution from the channels is the defining feature of the average method.', 'gray', '7'],
    ['A conversion technique based on the extreme RGB component values rather than all three equally.', 'Lightness method', 'The largest and smallest channel values determine the gray level in this method.', 'gray', '9'],
    ['A conversion technique that assigns different importance to the RGB components when producing a gray level.', 'Luminosity method / weighted method', 'The lesson also calls this the weighted method because the channels contribute unequally.', 'gray', '11'],
    ['The single light-related sample stored for each pixel in a grayscale image.', 'Intensity value / gray level', 'A grayscale pixel carries a light-intensity value and no hue.', 'gray', '3'],
    ['An image representation in which each pixel contains only an amount of light.', 'Grayscale', 'The lesson defines grayscale through intensity-only pixel information.', 'gray', '3'],
  ]]),
  category(3, 'Read the histogram', 'DISTRIBUTION TERMS', [[
    ['A frequency distribution showing how often each different value in a data set occurs.', 'Histogram', 'This is the general definition given before the lesson applies histograms to images.', 'hist', '4'],
    ['A frequency distribution showing how often each pixel intensity occurs in an image.', 'Image histogram', 'It summarizes pixel intensity counts in a compact statistical form.', 'hist', '5'],
    ['The number of times a particular intensity value occurs in an image.', 'Frequency / pixel count', 'The vertical axis of an image histogram represents the frequency of each intensity.', 'hist', '5'],
    ['The image values represented along the horizontal axis of an image histogram.', 'Gray-level intensities', 'The horizontal axis identifies the intensity values whose occurrences are being counted.', 'hist', '5'],
    ['The pattern of dark and light intensity values summarized by an image histogram.', 'Tonal distribution', 'The lesson says a histogram describes tonal distribution rather than pixel positions.', 'hist', '11'],
  ], [
    ['A compact statistical summary of pixel intensities that leaves out their locations.', 'Image histogram', 'A histogram contains intensity frequencies but no spatial arrangement information.', 'hist', '5'],
    ['The information about pixel positions that is missing from an image histogram.', 'Spatial arrangement', 'Different spatial arrangements can produce the same intensity-frequency distribution.', 'hist', '5, 9–11'],
    ['The intensity-count information represented by the vertical axis of an image histogram.', 'Frequency', 'This axis counts pixels at each gray level.', 'hist', '5'],
    ['The brightness-related values whose occurrences are counted in a grayscale image histogram.', 'Gray-level intensities', 'These values identify the different intensity levels represented in the image.', 'hist', '5, 14'],
    ['An exposure condition associated with an image dominated by dark tones.', 'Underexposure', 'The exposure slide compares underexposed, properly exposed, and overexposed images with their histograms.', 'hist', '16'],
  ]]),
  category(4, 'Contrast & equalize', 'ENHANCEMENT TERMS', [[
    ['The difference between the maximum and minimum pixel intensities used in an image.', 'Contrast', 'The lesson defines image contrast through the range of intensities effectively used.', 'equal', '8'],
    ['A condition in which an image uses a narrow range of intensities and appears flat or hazy.', 'Low contrast', 'The lesson associates low contrast with a compressed tonal range and a softer appearance.', 'equal', '8–10'],
    ['A condition in which strong differences between light and dark make subjects stand out.', 'High contrast', 'The lesson describes high contrast as bold and dramatic, with a wider tonal separation.', 'equal', '8–10'],
    ['A contrast-enhancement technique that expands the range of intensities used by an image.', 'Histogram stretching / contrast stretching', 'Stretching spreads the used intensity range toward the available output range.', 'hist', '20'],
    ['A histogram-based technique used to enhance image contrast, though it does not guarantee improvement in every image.', 'Histogram equalization', 'The lesson explicitly notes that equalization may make some images worse.', 'equal', '12'],
  ], [
    ['A process that increases contrast by spreading a compressed intensity range across a broader range.', 'Histogram stretching / contrast stretching', 'The histogram-stretching lesson connects a wider used intensity range with increased contrast.', 'hist', '18, 20'],
    ['A compressed tonal range with little difference between the darkest and brightest parts of an image.', 'Low contrast', 'Low-contrast images use a relatively narrow range of intensities.', 'equal', '8–10'],
    ['A broad separation between light and dark tones that gives an image a bold appearance.', 'High contrast', 'The contrast lesson associates this condition with dramatic tonal differences.', 'equal', '8–10'],
    ['A function describing the probability of each possible pixel intensity.', 'Probability mass function / PMF', 'The lesson identifies this as the first probability function used in histogram equalization.', 'equal', '18–19'],
    ['A function describing accumulated probabilities up to and including a given intensity.', 'Cumulative distribution function / CDF', 'The lesson calculates this after the probability mass function during histogram equalization.', 'equal', '18–19'],
  ]]),
  category(5, 'Spatial filters', 'FILTER DEFINITIONS', [[
    ['An image-enhancement technique that uses spatial characteristics and neighboring pixel values.', 'Spatial filtering', 'The lesson lists sharpening, edge detection, blurring, and noise reduction among its uses.', 'spatial', '2–3'],
    ['A simple low-pass filter that averages a pixel neighborhood and reduces local differences.', 'Mean filter / average filter', 'The mean filter improves noisy images but also reduces sharpness.', 'spatial', '13'],
    ['A blurring filter whose kernel has the shape of a bell-shaped hump.', 'Gaussian filter', 'The Gaussian filter removes detail and noise using a bell-shaped weighting pattern.', 'spatial', '15'],
    ['A nonlinear filter that is particularly effective at removing salt-and-pepper noise.', 'Median filter', 'The lesson identifies this noise-removal method as nonlinear.', 'spatial', '17'],
    ['A smoothing technique that replaces only extreme values to remove noise spikes while preserving sharp detail.', 'Conservative smoothing', 'It sacrifices some noise-suppression power to preserve high-spatial-frequency details such as edges.', 'spatial', '19'],
  ], [
    ['A small subimage used with a pixel neighborhood during spatial filtering.', 'Filter mask / kernel', 'The lesson also calls it a filter, template, or window.', 'spatial', '3'],
    ['The numerical values inside a filter mask, rather than image pixel values.', 'Coefficients', 'The lesson uses this term for the values within the filter subimage.', 'spatial', '3'],
    ['A family of spatial filters that smooth local variation and blur image detail.', 'Smoothing spatial filters', 'The lesson presents averaging and weighted-averaging masks under this heading.', 'spatial', '6–9, 13'],
    ['A filter that reduces noise by replacing a neighborhood value with its middle-ranked intensity.', 'Median filter', 'The median is the middle value after the neighborhood values are ordered; it is especially useful for impulse noise.', 'spatial', '17'],
    ['A noise-reduction method designed to remove spikes while retaining high-spatial-frequency details such as sharp edges.', 'Conservative smoothing', 'The lesson emphasizes preserving detail and replacing only extreme values.', 'spatial', '19–20'],
  ]]),
];
export const jeopardyClues = jeopardyCategories.flatMap(category => category.rounds.flat());
export const finalJeopardyClue: JeopardyClue = {
  id: 'final', category: 'Final Jeopardy', round: 2, value: 0,
  prompt: 'A histogram-based contrast-enhancement technique that uses an intensity probability distribution and its cumulative distribution.',
  answer: 'Histogram equalization',
  explanation: 'The lesson describes histogram equalization using a probability mass function followed by a cumulative distribution function. Its purpose is contrast enhancement.',
  source: 'equal', pages: '12, 18–19',
};
