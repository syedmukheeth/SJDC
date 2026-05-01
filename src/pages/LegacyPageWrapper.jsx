import React, { useEffect, useState, useRef } from 'react';
import { useParams, Navigate } from 'react-router-dom';

const LegacyPageWrapper = () => {
  const { slug } = useParams();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(false);

    const fetchLegacyPage = async () => {
      try {
        const response = await fetch(`/legacy/${slug}.html`);
        if (!response.ok) {
          throw new Error('Page not found');
        }
        
        let htmlText = await response.text();
        
        // Parse the HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        
        // Remove old header, footer, and mobile menus to prevent duplication with our new Layout
        const elementsToRemove = doc.querySelectorAll('header, footer, #header2, .footer-area, .mobile-menu-area, script, noscript, iframe, link');
        elementsToRemove.forEach(el => el.remove());

        // Fix image and link paths since the files are now in /legacy/
        const images = doc.querySelectorAll('img');
        images.forEach(img => {
          const src = img.getAttribute('src');
          if (src && !src.startsWith('http') && !src.startsWith('/')) {
            img.setAttribute('src', `/legacy/${src}`);
          }
          // Add fallback for missing staff images
          img.setAttribute('onerror', "this.onerror=null; this.src='https://ui-avatars.com/api/?name=Staff&background=0D8ABC&color=fff&size=128'; this.className += ' fallback-avatar';");
        });

        const links = doc.querySelectorAll('a');
        links.forEach(a => {
          let href = a.getAttribute('href');
          if (!href || href === '#') return;

          // CRITICAL: If it's an internal hash link (e.g., #Personal), leave it alone
          if (href.startsWith('#')) return;
          
          // Split href into components: base, query, hash
          const [urlPart, hashPart] = href.split('#');
          const [basePart, queryPart] = urlPart.split('?');
          const hash = hashPart ? `#${hashPart}` : '';
          const query = queryPart ? `?${queryPart}` : '';

          // Handle Home variations at the root level
          if (basePart === 'index.html' || basePart === 'Default.html' || basePart === '') {
            a.setAttribute('href', `/${query}${hash}`);
          } 
          // Handle Contact
          else if (basePart === 'contact-us.html') {
            a.setAttribute('href', `/#contact`);
          }
          // Handle other legacy HTML pages
          else if (basePart.endsWith('.html') && !basePart.startsWith('http')) {
            const newSlug = basePart.slice(0, -5); // Remove .html
            a.setAttribute('href', `/page/${newSlug}${query}${hash}`);
          } 
          // Handle local assets (PDFs, images, etc.)
          else if (!basePart.startsWith('http') && !basePart.startsWith('/') && basePart.length > 0) {
             a.setAttribute('href', `/legacy/${href}`);
          }
        });

        if (isMounted) {
          setContent(doc.body.innerHTML);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load legacy page:', err);
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      }
    };

    fetchLegacyPage();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Inject Vanilla JS handler for Bootstrap Tabs
  useEffect(() => {
    if (!content || !containerRef.current) return;

    const handleTabClick = (e) => {
      const tabLink = e.target.closest('a[data-toggle="tab"], a[data-toggle="pill"]');
      if (!tabLink) return;

      e.preventDefault();
      
      const targetId = tabLink.getAttribute('href')?.replace('#', '');
      if (!targetId) return;

      // Update URL hash without jumping
      window.history.replaceState(null, null, `#${targetId}`);
      
      switchTab(targetId);
    };

    const switchTab = (targetId) => {
      const container = containerRef.current;
      if (!container) return;

      // 1. Update Tabs
      const allTabs = container.querySelectorAll('a[data-toggle="tab"], a[data-toggle="pill"]');
      allTabs.forEach(t => {
        const li = t.parentElement;
        const tid = t.getAttribute('href')?.replace('#', '');
        if (tid === targetId) {
          li.classList.add('active');
        } else {
          li.classList.remove('active');
        }
      });

      // 2. Update Panes
      const allPanes = container.querySelectorAll('.tab-pane');
      allPanes.forEach(p => {
        if (p.id === targetId) {
          p.classList.add('active', 'in');
          p.style.setProperty('display', 'block', 'important');
          p.style.setProperty('opacity', '1', 'important');
          p.style.setProperty('visibility', 'visible', 'important');
        } else {
          p.classList.remove('active', 'in');
          p.style.setProperty('display', 'none', 'important');
          p.style.setProperty('opacity', '0', 'important');
        }
      });
    };

    const setupInitialTab = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        switchTab(hash);
      } else {
        const container = containerRef.current;
        const activeTab = container?.querySelector('li.active a[data-toggle="tab"], li.active a[data-toggle="pill"]');
        if (activeTab) {
          const targetId = activeTab.getAttribute('href')?.replace('#', '');
          if (targetId) switchTab(targetId);
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('click', handleTabClick);
      setTimeout(setupInitialTab, 100);
    }

    return () => {
      if (container) {
        container.removeEventListener('click', handleTabClick);
      }
    };
  }, [content]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Content Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md">The requested academic page is currently being migrated or is unavailable in our digital archive.</p>
        <button 
          onClick={() => window.location.href = '/'}
          className="px-8 py-3 bg-primary text-white rounded-xl font-semibold shadow-lg hover:bg-primary/90 transition-all active:scale-95"
        >
          Return to Portal Home
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-[60vh] legacy-wrapper">
      {/* 
        We use dangerouslySetInnerHTML to render the parsed HTML. 
        Note: We add some basic global padding/styles to ensure it doesn't touch the edges.
      */}
      <div 
        ref={containerRef}
        className="w-full mx-auto"
        dangerouslySetInnerHTML={{ __html: content }} 
      />
    </div>
  );
};

export default LegacyPageWrapper;
