import path from "path";

/**
 * Updates the video information for a specific chapter within a course
 * @param course - The course object containing sections and chapters
 * @param sectionId - The ID of the section containing the target chapter
 * @param chapterId - The ID of the chapter to update
 * @param videoUrl - The new video URL to set for the chapter
 * @throws Error if section or chapter is not found
 */

export const updateCourseVideoInfo = (
  course: any,
  sectionId: string,
  chapterId: string,
  videoUrl: string
) => {
  const section = course.sections?.find((s: any) => s.sectionId === sectionId);
  if (!section) {
    throw new Error(`Section not found: ${sectionId}`);
  }

  const chapter = section.chapters?.find((c: any) => c.chapterId === chapterId);
  if (!chapter) {
    throw new Error(`Chapter not found: ${chapterId}`);
  }

  chapter.video = videoUrl;
  chapter.type = "Video";
};

export const validateUploadedFiles = (files: any) => {
  const allowedExtensions = [".mp4", ".m3u8", ".mpd", ".ts", ".m4s"];
  for (const file of files) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      throw new Error(`Unsupported file type: ${ext}`);
    }
  }
};

export const getContentType = (filename: string) => {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case ".mp4":
      return "video/mp4";
    case ".m3u8":
      return "application/vnd.apple.mpegurl";
    case ".mpd":
      return "application/dash+xml";
    case ".ts":
      return "video/MP2T";
    case ".m4s":
      return "video/iso.segment";
    default:
      return "application/octet-stream";
  }
};

// Preserved HLS/DASH upload logic for future use
export const handleAdvancedVideoUpload = async (
  s3: any,
  files: any,
  uniqueId: string,
  bucketName: string
) => {
  const isHLSOrDASH = files.some(
    (file: any) =>
      file.originalname.endsWith(".m3u8") || file.originalname.endsWith(".mpd")
  );

  if (isHLSOrDASH) {
    // Handle HLS/MPEG-DASH Upload
    const uploadPromises = files.map((file: any) => {
      const s3Key = `videos/${uniqueId}/${file.originalname}`;
      return s3
        .upload({
          Bucket: bucketName,
          Key: s3Key,
          Body: file.buffer,
          ContentType: getContentType(file.originalname),
        })
        .promise();
    });
    await Promise.all(uploadPromises);

    // Determine manifest file URL
    const manifestFile = files.find(
      (file: any) =>
        file.originalname.endsWith(".m3u8") ||
        file.originalname.endsWith(".mpd")
    );
    const manifestFileName = manifestFile?.originalname || "";
    const videoType = manifestFileName.endsWith(".m3u8") ? "hls" : "dash";

    return {
      videoUrl: `${process.env.CLOUDFRONT_DOMAIN}/videos/${uniqueId}/${manifestFileName}`,
      videoType,
    };
  }

  return null; // Return null if not HLS/DASH to handle regular upload
};

/**
 * Merges two arrays of course sections, preserving existing sections while adding new ones.
 * If a section already exists (matched by sectionId), its chapters are merged with the new chapters.
 * If a section doesn't exist, it is added to the resulting array.
 *
 * @param existingSections - Array of current course sections
 * @param newSections - Array of new sections to merge in
 * @returns Array of merged sections with updated chapters
 *
 * Example section structure:
 * {
 *   sectionId: string,
 *   sectionTitle: string,
 *   chapters: Array<{
 *     chapterId: string,
 *     title: string,
 *     content: string,
 *     ...other chapter fields
 *   }>
 * }
 */

export const mergeSections = (
  existingSections: any[],
  newSections: any[]
): any[] => {
  const existingSectionsMap = new Map<string, any>();
  for (const existingSection of existingSections) {
    existingSectionsMap.set(existingSection.sectionId, existingSection);
  }

  for (const newSection of newSections) {
    const section = existingSectionsMap.get(newSection.sectionId);
    if (!section) {
      // Add new section
      existingSectionsMap.set(newSection.sectionId, newSection);
    } else {
      // Merge chapters within the existing section
      section.chapters = mergeChapters(section.chapters, newSection.chapters);
      existingSectionsMap.set(newSection.sectionId, section);
    }
  }

  return Array.from(existingSectionsMap.values());
};

export const mergeChapters = (
  existingChapters: any[],
  newChapters: any[]
): any[] => {
  const existingChaptersMap = new Map<string, any>();
  for (const existingChapter of existingChapters) {
    existingChaptersMap.set(existingChapter.chapterId, existingChapter);
  }

  for (const newChapter of newChapters) {
    existingChaptersMap.set(newChapter.chapterId, {
      ...(existingChaptersMap.get(newChapter.chapterId) || {}),
      ...newChapter,
    });
  }

  return Array.from(existingChaptersMap.values());
};

export const calculateOverallProgress = (sections: any[]): number => {
  const totalChapters = sections.reduce(
    (acc: number, section: any) => acc + section.chapters.length,
    0
  );

  const completedChapters = sections.reduce(
    (acc: number, section: any) =>
      acc + section.chapters.filter((chapter: any) => chapter.completed).length,
    0
  );

  return totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;
};
