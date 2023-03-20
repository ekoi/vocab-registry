import {Vocab} from '../misc/interfaces';

export default function Summary({data}: { data: Vocab }) {
    if (!data.summary)
        return <div>No summarized data available!</div>;

    const summary = data.summary;

    return (
        <table className="vocabSummary">
            <thead>
            <tr>
                <th>Vocabulary</th>
                <th>Subjects</th>
                <th>Predicates</th>
                <th colSpan={2}>Objects</th>
                <th>Total</th>
            </tr>
            <tr>
                <th colSpan={3}>&nbsp;</th>
                <th>Classes</th>
                <th>Literals</th>
                <th>&nbsp;</th>
            </tr>
            </thead>

            <tbody>
            {summary.stats.stats.map(stat => (
                <tr key={stat.prefix}>
                    <th>{stat.uri} <span className="prefix">{stat.prefix}</span></th>
                    <td>{summary.subjects.stats.find(s => s.prefix === stat.prefix)?.count ?? 0}</td>
                    <td>{summary.predicates.stats.find(s => s.prefix === stat.prefix)?.count ?? 0}</td>
                    <td>{summary.objects.classes?.stats?.find(s => s.prefix === stat.prefix)?.count ?? 0}</td>
                    <td>{summary.objects.literals?.stats?.find(s => s.prefix === stat.prefix)?.count ?? 0}</td>
                    <td>{stat.count ?? 0}</td>
                </tr>
            ))}
            </tbody>

            <tfoot>
            <tr>
                <th>&nbsp;</th>
                <th>{summary.subjects.count ?? 0}</th>
                <th>{summary.predicates.count ?? 0}</th>
                <th>{summary.objects.classes?.count ?? 0}</th>
                <th>{summary.objects.literals?.count ?? 0}</th>
                <th>{summary.stats.count ?? 0}</th>
            </tr>
            </tfoot>
        </table>
    );
}
