// Define an interface for the contents
interface Contents {
    [key: string]: string;
  }
  
  // Define an interface for each section of the table of contents
interface TableOfContentsSection {
    title: string;
    contents: Contents;
}

export type TableOfContentsModel = TableOfContentsSection[]