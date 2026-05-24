import React, { useState } from 'react';
import { 
  Button, 
  Text, 
  Card, 
  CardHeader,
  CardFooter,
  Title3,
  Spinner,
  Link,
  Divider,
  makeStyles,
  tokens
} from '@fluentui/react-components';

import {
  ABLEIST_TERMS,
  DISABILITY_METAPHORS,
  ENGLISH_IDIOMS
} from '@a11yfred/neighbor/rules';

const useStyles = makeStyles({
  container: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    backgroundColor: tokens.colorNeutralBackground1,
  },
  card: {
    marginBottom: '12px',
    border: `1px solid ${tokens.colorNeutralStroke2}`
  },
  suggestion: {
    fontFamily: 'monospace',
    fontWeight: 'bold'
  },
  sources: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3
  },
  footerLink: {
    textDecoration: 'underline',
    padding: '2px 4px',
    borderRadius: '4px',
    '&:hover': {
      textDecoration: 'none',
      color: tokens.colorNeutralBackground1,
      backgroundColor: tokens.colorBrandForeground1
    },
    '&:focus-visible': {
      color: tokens.colorNeutralBackground1,
      backgroundColor: tokens.colorBrandForeground1,
      textDecoration: 'none'
    }
  },
  githubLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    textDecoration: 'underline',
    padding: '2px 4px',
    borderRadius: '4px',
    '&:hover': {
      textDecoration: 'none',
      color: tokens.colorNeutralBackground1,
      backgroundColor: tokens.colorBrandForeground1
    },
    '&:focus-visible': {
      color: tokens.colorNeutralBackground1,
      backgroundColor: tokens.colorBrandForeground1,
      textDecoration: 'none'
    }
  },
  highlightButton: {
    marginTop: '12px',
    marginBottom: '12px',
    color: tokens.colorBrandForeground1,
    borderColor: tokens.colorBrandForeground1,
    '&:focus-visible': {
      color: '#ffffff',
      backgroundColor: tokens.colorBrandBackground,
      borderColor: '#ffffff'
    }
  },
  subtleHighlight: {
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorNeutralForeground1,
    padding: '2px 4px',
    borderRadius: '4px',
  }
});

function App({ isOfficeInitialized }) {
  const styles = useStyles();
  const [isScanning, setIsScanning] = useState(false);
  const [foundIssues, setFoundIssues] = useState([]);
  const [hasScanned, setHasScanned] = useState(false);

  if (!isOfficeInitialized) {
    return (
      <div className={styles.container}>
        <Title3>Neighbor</Title3>
        <Text>Please side-load this add-in into Microsoft Word to use it.</Text>
      </div>
    );
  }

  const scanDocument = async () => {
    setIsScanning(true);
    try {
      await Word.run(async (context) => {
        const body = context.document.body;
        context.load(body, 'text');
        await context.sync();
        
        const fullText = body.text;
        const issues = [];

        const checkList = (list, ruleName) => {
          for (const { term, suggest, sources } of list) {
            const flags = term.flags.includes('g') ? term.flags : term.flags + 'g';
            const regex = new RegExp(term.source, flags);
            let m;
            while ((m = regex.exec(fullText)) !== null) {
              issues.push({
                id: Math.random().toString(),
                match: m[0],
                suggest,
                sources,
                rule: ruleName
              });
            }
          }
        }

        checkList(ABLEIST_TERMS, "Ableist Language");
        checkList(DISABILITY_METAPHORS, "Disability Metaphor");
        checkList(ENGLISH_IDIOMS, "Opaque Idiom");
        
        setFoundIssues(issues);
        setHasScanned(true);
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsScanning(false);
    }
  };

  const highlightIssue = async (matchText) => {
    try {
      await Word.run(async (context) => {
        const searchResults = context.document.body.search(matchText, { matchCase: false, matchWholeWord: false });
        context.load(searchResults);
        await context.sync();

        for (let i = 0; i < searchResults.items.length; i++) {
          searchResults.items[i].font.highlightColor = "yellow";
          if (i === 0) searchResults.items[i].select(); // Select the first one so Word scrolls to it
        }
        await context.sync();
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <Text size={400} style={{ lineHeight: '1.5' }}>
        Scan your document for accessible and inclusive English language. Neighbor instantly checks your writing for ableist terms, disability metaphors, and opaque idioms.
      </Text>
      
      <Button 
        appearance="primary" 
        size="large" 
        icon={<svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.5 11.5C9.26142 11.5 11.5 9.26142 11.5 6.5C11.5 3.73858 9.26142 1.5 6.5 1.5C3.73858 1.5 1.5 3.73858 1.5 6.5C1.5 9.26142 3.73858 11.5 6.5 11.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M14.5 14.5L10.035 10.035" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        onClick={scanDocument} 
        disabled={isScanning}
        style={{ marginTop: '24px', marginBottom: '24px', fontSize: '18px', fontWeight: 'bold', padding: '16px 24px', minHeight: '52px', border: '1px solid #ffffff' }}
      >
        {isScanning ? <Spinner size="tiny" /> : "Scan Document"}
      </Button>

      {hasScanned && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '8px' }}>
          <Divider />
          <Title3>{foundIssues.length} {foundIssues.length === 1 ? 'Result' : 'Results'}</Title3>
        </div>
      )}

      {hasScanned && foundIssues.length === 0 && (
        <Text>No issues found! Your document looks great.</Text>
      )}

      {foundIssues.map((issue) => (
        <Card key={issue.id} className={styles.card}>
          <CardHeader header={<Text weight="bold" size={400}>{issue.rule}</Text>} />
          <Divider style={{ margin: '0px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: '8px', alignItems: 'flex-start' }}>
            <Text weight="bold">Found:</Text>
            <Text font="monospace" className={styles.subtleHighlight} style={{ marginLeft: '16px' }}>"{issue.match}"</Text>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: '8px', alignItems: 'flex-start' }}>
            <Text weight="bold">Suggestion:</Text>
            <Text font="monospace" style={{ marginLeft: '16px' }}>{issue.suggest}</Text>
          </div>
          <CardFooter>
            <Button 
              onClick={() => highlightIssue(issue.match)} 
              appearance="outline"
              className={styles.highlightButton}
            >
              Highlight in Document
            </Button>
          </CardFooter>
          <Text className={styles.sources}>Sources: {issue.sources}</Text>
        </Card>
      ))}

      <div style={{ marginTop: 'auto', paddingTop: '48px' }}>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <Text size={300} align="center">
            A part of <Link href="https://a11yfred.app" target="_blank" className={styles.footerLink}><strong>A11yFred</strong></Link>, your online neighbor.
          </Text>
        </div>
        <Divider />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', marginTop: '16px', marginBottom: '8px' }}>
          <Text size={300}>
            <Link href="https://github.com/a11yfred/neighbor" target="_blank" className={styles.githubLink}>
              <svg height="14" viewBox="0 0 16 16" width="14" style={{ fill: 'currentColor' }}><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
              View this on GitHub
            </Link>
          </Text>
          <Text size={300} style={{ color: tokens.colorNeutralForeground3 }}>Released under the MIT License</Text>
        </div>
      </div>
    </div>
  );
}

export default App;
