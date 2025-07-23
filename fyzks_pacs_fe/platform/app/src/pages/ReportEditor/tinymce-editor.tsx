// RichTextEditor.js
import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { debounce } from 'lodash';

const TinyEditor = ({ placeholder, initialContent, handleChange, fromReporting, headerContent, footerContent }) => {
  const editorRef = useRef(null);
  const [content, setContent] = useState(initialContent || '');

  useEffect(() => {
    if (initialContent !== content) {
      setContent(initialContent || '');
    }
  }, [initialContent]);

  const custprops = fromReporting ? {
    height: 1122, // A4 height in pixels (96 DPI)
    width: 794, // A4 width in pixels (96 DPI)
  } : {}

  const config = useMemo(
    () => ({
      height: custprops.height || 400,
      width: custprops.width || '100%',
      menubar: 'file edit view insert format tools table help',
      contextmenu: 'link image table spellchecker configurepermanentpen',
      quickbars_selection_toolbar: 'bold italic underline | strikethrough superscript subscript | quicklink',
      quickbars_insert_toolbar: 'quickimage media | hr | quicktable',
      plugins: [
        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
        'searchreplace', 'code', 'fullscreen', 'insertdatetime', 'media', 'table',
        'help', 'wordcount', 'pagebreak', 'print', 'paste', 'save'
      ],
      toolbar: [
        'undo redo | styles fontsize | bold italic underline | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
        'link image table | cut copy paste | searchreplace removeformat | insertdatetime charmap | code pagebreak | fullscreen print save help'
      ],
      content_style: `
        body {
          font-family: Arial, sans-serif;
          font-size: 14px;
          line-height: 1.6;
          margin: 0;
          padding: 20px;
        }
        ${fromReporting ? `
          /* A4 page styling for reporting */
          @page {
            size: A4;
            margin: 1in;
          }

          /* Remove header/footer CSS - now handled in React components */
          /* Page container */
          body {
            background: white;
            padding: 20px;
          }

          /* Content pages */
          .page-content {
            background: white;
            width: 8.5in;
            min-height: 11in;
            margin: 0 auto 20px;
            padding: 1in;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            page-break-after: always;
          }

          /* Page break styling */
          .mce-pagebreak {
            page-break-before: always;
            display: block;
            border: 0;
            width: 100%;
            height: 5px;
            border-top: 1px dashed #ccc;
            margin: 20px 0;
            background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="10"><text x="50%" y="50%" text-anchor="middle" dy="0.35em" font-size="10" fill="gray">Page Break</text></svg>') no-repeat center;
          }

          /* Auto page break styling */
          .mce-pagebreak.auto-break {
            border-top: 1px dashed #007cba;
            background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="10"><text x="50%" y="50%" text-anchor="middle" dy="0.35em" font-size="10" fill="blue">Auto Page Break</text></svg>') no-repeat center;
          }

          /* Page numbering */
          .page-number {
            position: absolute;
            bottom: 0.5in;
            right: 0.5in;
            font-size: 10px;
            color: #666;
          }

          @media print {
            body { background: white; padding: 0; }
            .page-content {
              box-shadow: none;
              margin: 0;
              width: 100%;
              min-height: auto;
            }
          }
        ` : ''}
      `,
      placeholder: placeholder || 'Start typing...',
      paste_data_images: true, // Enable image upload as Base64
      automatic_uploads: false,
      file_picker_types: 'image',
      file_picker_callback: function(callback, value, meta) {
        if (meta.filetype === 'image') {
          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');
          input.onchange = function() {
            const file = this.files[0];
            const reader = new FileReader();
            reader.onload = function() {
              callback(reader.result, { alt: file.name });
            };
            reader.readAsDataURL(file);
          };
          input.click();
        }
      },
      // Auto-pagination setup
      setup: function(editor) {
        if (fromReporting) {
          // Add custom page break button
          editor.ui.registry.addButton('pagebreak', {
            icon: 'new-document',
            tooltip: 'Insert Page Break',
            onAction: function() {
              editor.insertContent('<div class="mce-pagebreak"></div>');
            }
          });

          // Handle Tab key press
          editor.on('keydown', function(e) {
            if (e.keyCode === 9) { // Tab key
              e.preventDefault(); // Prevent default tab behavior (focus change)

              // Option 1: Insert tab spaces (4 spaces)
              editor.insertContent('&nbsp;&nbsp;&nbsp;&nbsp;');

              // Option 2: Insert actual tab character (uncomment to use this instead)
              // editor.insertContent('\t');

              // Option 3: Indent current line/selection (uncomment to use this instead)
              // editor.execCommand('Indent');
            }

            // Handle Shift+Tab for outdent
            if (e.keyCode === 9 && e.shiftKey) {
              e.preventDefault();
              editor.execCommand('Outdent');
            }
          });

          let enterPressed = false;

          editor.on('keydown', function(e) {
            if (e.keyCode === 13) { // Enter
              enterPressed = true;
            }
          });

          editor.on('keydown', function(e) {
            // If Enter was just pressed AND this is a letter key
            if (enterPressed && e.keyCode >= 65 && e.keyCode <= 90) {
              enterPressed = false;
              
              // Force the letter to be uppercase
              e.preventDefault();
              const upperCaseLetter = String.fromCharCode(e.keyCode);
              editor.insertContent(upperCaseLetter);
            }
            // Reset flag for any other key
            else if (enterPressed && e.keyCode !== 13) {
              enterPressed = false;
            }
          });


          // Auto-pagination logic
          const autoPaginate = debounce(function() {
            try {
              const body = editor.getBody();
              if (!body) return;

              // Store current scroll position, selection, and focus state
              const scrollTop = body.scrollTop || 0;
              const hadFocus = editor.hasFocus();
              const selection = editor.selection;
              const range = selection.getRng();
              const bookmark = selection.getBookmark(2, true);
              const cursorPosition = selection.getRng().startOffset;
              const currentNode = selection.getNode();

              // Remove existing auto page breaks and page headers/footers
              const existingAutoBreaks = body.querySelectorAll('.mce-pagebreak.auto-break, .page-header-content, .page-footer-content');
              const hadAutoBreaks = existingAutoBreaks.length > 0;
              existingAutoBreaks.forEach(br => br.remove());

              // Calculate page height - adjust for header/footer if present
              let pageHeight = 780;
              if (headerContent || footerContent) {
                pageHeight -= 250; // Reduce available content height for header/footer
              }

              let currentHeight = 0;
              let pageCount = 1;
              let needsUpdate = false;
              let pageBreakInsertedBeforeCursor = false;
              let newCursorTarget = null;

              // Add header to first page if provided
              if (headerContent) {
                const firstPageHeader = document.createElement('div');
                firstPageHeader.className = 'page-header-content';
                firstPageHeader.style.cssText = `
                  display: block;
                  width: 100%;
                  height: 150px;
                  background: white;
                  // border-bottom: 1px solid #ddd;
                  // padding: 10px;
                  font-size: 12px;
                  margin-bottom: 10px;
                  text-align: center;
                `;
                firstPageHeader.innerHTML = headerContent;
                firstPageHeader.setAttribute('contenteditable', 'false');

                if (body.firstChild) {
                  body.insertBefore(firstPageHeader, body.firstChild);
                } else {
                  body.appendChild(firstPageHeader);
                }
                needsUpdate = true;
              }

              // Get all direct children of body and process them
              const elements = Array.from(body.children);

              for (let i = 0; i < elements.length; i++) {
                const element = elements[i];

                // Skip manual page breaks - reset height counter
                if (element.classList && element.classList.contains('mce-pagebreak') && !element.classList.contains('auto-break')) {
                  currentHeight = 0;
                  pageCount++;
                  continue;
                }

                // Skip if element is already an auto page break or header/footer
                if (element.classList && (element.classList.contains('auto-break') || element.classList.contains('page-header-content') || element.classList.contains('page-footer-content'))) {
                  continue;
                }

                // Check if this element contains the cursor
                const containsCursor = element.contains(currentNode) || element === currentNode;

                // Calculate element height using offset height (more reliable)
                const elementHeight = element.offsetHeight || element.scrollHeight || 20;

                // Check if adding this element would overflow the page
                if (currentHeight + elementHeight > pageHeight && currentHeight > 0) {

                  // Add footer to current page if provided
                  if (footerContent) {
                    const pageFooter = document.createElement('div');
                    pageFooter.className = 'page-footer-content';
                    pageFooter.style.cssText = `
                      display: block;
                      width: 90%;
                      margin: auto;
                      height: auto;
                      background: transparent;
                      border: none;
                      padding: 8px 10px;
                      font-size: 14px;
                      margin: 10px auto;
                      text-align: left;
                      color: #333;
                      line-height: 1.4; 
                    `;
                    pageFooter.innerHTML = footerContent;
                    pageFooter.setAttribute('contenteditable', 'false');
                    element.parentNode.insertBefore(pageFooter, element);
                  }

                  // Create page break element
                  const pageBreak = document.createElement('div');
                  pageBreak.className = 'mce-pagebreak auto-break';
                  pageBreak.setAttribute('contenteditable', 'false');
                  pageBreak.style.cssText = 'page-break-before: always; display: block; border: 0; width: 100%; height: 30px; border-top: 2px dashed #007cba; margin: 15px 0; position: relative; background: #f0f8ff; text-align: center; line-height: 30px; font-size: 12px; color: #007cba; font-weight: bold;';
                  pageBreak.innerHTML = '🔸 AUTO PAGE BREAK 🔸';

                  // Insert page break
                  element.parentNode.insertBefore(pageBreak, element);

                  // Add header to new page if provided
                  if (headerContent) {
                    const pageHeader = document.createElement('div');
                    pageHeader.className = 'page-header-content';
                    pageHeader.style.cssText = `
                      display: block;
                      width: 100%;
                      height: 150px;
                      background: white;
                      border-bottom: 1px solid #ddd;
                      padding: 10px;
                      font-size: 12px;
                      margin-bottom: 10px;
                      text-align: center;
                    `;
                    pageHeader.innerHTML = headerContent;
                    pageHeader.setAttribute('contenteditable', 'false');
                    element.parentNode.insertBefore(pageHeader, element);
                  }

                  // If cursor was in this element, we need to adjust cursor position
                  if (containsCursor) {
                    pageBreakInsertedBeforeCursor = true;
                    newCursorTarget = element;
                  }

                  currentHeight = elementHeight;
                  pageCount++;
                  needsUpdate = true;
                } else {
                  currentHeight += elementHeight;
                }
              }

              // Add footer to last page if provided
              if (footerContent && pageCount >= 1) {
                const lastPageFooter = document.createElement('div');
                lastPageFooter.className = 'page-footer-content';
                lastPageFooter.style.cssText = `
                  display: block;
                  width: 90%;
                  margin: auto;
                  height: auto;
                  background: transparent;
                  border: none;
                  padding: 8px 10px;
                  font-size: 14px;
                  margin: 10px auto;
                  text-align: left;
                  color: #333;
                  line-height: 1.4; 
                `;
                lastPageFooter.innerHTML = footerContent;
                lastPageFooter.setAttribute('contenteditable', 'false');
                body.appendChild(lastPageFooter);
                needsUpdate = true;
              }

              // Only update if there were actual changes
              if (needsUpdate || hadAutoBreaks) {
                // Use requestAnimationFrame for smoother updates
                requestAnimationFrame(() => {
                  try {
                    // Restore focus first
                    if (hadFocus) {
                      editor.focus();
                    }

                    // Handle cursor position based on whether page break was inserted
                    if (pageBreakInsertedBeforeCursor && newCursorTarget) {
                      // Position cursor at the element that's now after the page break
                      selection.select(newCursorTarget);
                      selection.collapse(true);

                      // Try to restore the exact character position within the element
                      if (cursorPosition > 0 && newCursorTarget.firstChild) {
                        try {
                          const textNode = newCursorTarget.firstChild;
                          if (textNode.nodeType === 3) { // Text node
                            const newRange = document.createRange();
                            const maxOffset = Math.min(cursorPosition, textNode.textContent.length);
                            newRange.setStart(textNode, maxOffset);
                            newRange.setEnd(textNode, maxOffset);
                            selection.setRng(newRange);
                          }
                        } catch (offsetError) {
                          // Fallback to start of element
                          selection.select(newCursorTarget);
                          selection.collapse(true);
                        }
                      }
                    } else {
                      // No page break affected cursor, restore original position
                      if (bookmark && bookmark.start) {
                        selection.moveToBookmark(bookmark);
                      } else if (range) {
                        selection.setRng(range);
                      }
                    }

                    // Restore scroll position
                    setTimeout(() => {
                      if (body.scrollTo) {
                        body.scrollTo(0, scrollTop);
                      } else {
                        body.scrollTop = scrollTop;
                      }
                    }, 5);

                    // Minimal node change notification
                    editor.nodeChanged();

                    // Ensure focus is maintained for continued typing
                    if (hadFocus && !editor.hasFocus()) {
                      editor.focus();
                    }
                  } catch (restoreError) {
                    console.warn('Selection restore error:', restoreError);
                    // Fallback: position cursor at end of content
                    if (hadFocus) {
                      editor.focus();
                      const lastElement = body.lastElementChild;
                      if (lastElement && !lastElement.classList.contains('mce-pagebreak')) {
                        selection.select(lastElement);
                        selection.collapse(false); // End of element
                      }
                    }
                  }
                });
              }

              // Reduced logging for smoother performance
              if (needsUpdate) {
                console.log(`Auto-pagination: ${pageCount} pages`);
              }
            } catch (error) {
              console.error('Auto-pagination error:', error);
            }
          }, 400); // Reduced debounce for more responsive feel

          // Single event handler - covers all scenarios!
          editor.on('SetContent', () => {
            autoPaginate(); // No timeout needed!
          });

          // Keep init for the initial load
          editor.on('init', () => {
            setTimeout(autoPaginate, 100); // Small delay for editor to fully initialize
          });
        }
      }
    }),
    [placeholder, fromReporting, custprops]
  );

  const debouncedHandleChange = useMemo(() =>
    debounce((newContent) => {
      setContent(newContent);
      handleChange(newContent);
    }, 200), [handleChange]
  );

  const handleEditorChange = (newContent) => {
    setContent(newContent);
    debouncedHandleChange(newContent);
  };

  return (
    <Editor
      apiKey="oyihh104u7uqowi7ttzexht0ur54q3wlpubehg40ypp4jzzr"
      onInit={(evt, editor) => editorRef.current = editor}
      value={content}
      init={config}
      onBlur={(evt) => {
        const currentContent = evt.target.getContent();
        setContent(currentContent);
        handleChange(currentContent);
      }}
      onEditorChange={handleEditorChange}
    />
  );
}

export default TinyEditor;
