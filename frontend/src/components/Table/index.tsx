import { Spinner } from 'flowbite-react';
import type { FC } from 'react';
import type { DataItem } from '../../@types';

export type TableProps = {
	title: string;
	description: string;
	columns: { value: string; label: string }[];
	data: DataItem[];
	clearButtonFunction?: VoidFunction;
	isLoading?: boolean;
};

const Table: FC<TableProps> = ({ title, description, columns, data, clearButtonFunction, isLoading = false }) => {
	return (
		<div className="px-4 sm:px-6 lg:px-8">
			<div className="sm:flex sm:items-center">
				<div className="sm:flex-auto">
					<h1 className="text-base font-semibold leading-6 text-gray-900">{title}</h1>
					<p className="mt-2 text-sm text-gray-700">{description}</p>
				</div>
				{clearButtonFunction && (
					<div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
						<button
							type="button"
							onClick={clearButtonFunction}
							className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						>
							Limpar dados
						</button>
					</div>
				)}
			</div>
			<div className="mt-8 flow-root">
				<div className="-mx-4 -my-2 overflow-auto sm:-mx-6 lg:-mx-8 max-h-96">
					<div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
						{isLoading ? (
							<div className="flex items-center justify-center">
								<Spinner size="lg" />
							</div>
						) : (
							<table className="min-w-full divide-y divide-gray-300">
								<thead className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 backdrop-blur backdrop-filter">
									<tr className="divide-x divide-gray-200">
										{columns.map(({ value, label }, index) => (
											<th
												key={`table-head-${value}-${index}`}
												scope="col"
												className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
											>
												{label}
											</th>
										))}
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200 bg-white">
									{data.map((d, index) => (
										<tr key={`table-body-${index}`} className="divide-x divide-gray-200">
											{columns.map(({ value }, i) => (
												<td key={`table-body-item-${value}-${i}`} className="px-4 py-3.5 text-sm text-gray-900">
													{d[value]}
												</td>
											))}
										</tr>
									))}
								</tbody>
							</table>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Table;
