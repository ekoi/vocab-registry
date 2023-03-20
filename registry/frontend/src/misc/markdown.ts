import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import retextStringify from 'retext-stringify';

const processor = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(retextStringify);

export function parseTextFromMarkDown(mdString: string): string {
    return processor.processSync(mdString).toString();
}
