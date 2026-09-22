import { Modal } from '../ui';

const DEFAULT_CHART = [
  { size: 'XS', chest: '84-88', waist: '66-70', hip: '90-94' },
  { size: 'S', chest: '89-93', waist: '71-75', hip: '95-99' },
  { size: 'M', chest: '94-98', waist: '76-80', hip: '100-104' },
  { size: 'L', chest: '99-104', waist: '81-86', hip: '105-110' },
  { size: 'XL', chest: '105-110', waist: '87-92', hip: '111-116' },
  { size: 'XXL', chest: '111-118', waist: '93-100', hip: '117-124' },
];

export default function SizeGuideModal({ open, onClose, sizeGuide }) {
  const isImage = sizeGuide && /^https?:\/\//.test(sizeGuide);

  return (
    <Modal open={open} onClose={onClose} title="Size Guide" size="lg">
      {isImage ? (
        <img src={sizeGuide} alt="Size guide" className="w-full" />
      ) : (
        <>
          {sizeGuide && <p className="mb-4 text-sm text-grey">{sizeGuide}</p>}
          <p className="mb-4 text-xs text-grey">All measurements in centimeters.</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-grey-light text-left text-xs uppercase tracking-wide text-grey">
                <th className="py-2.5">Size</th>
                <th className="py-2.5">Chest</th>
                <th className="py-2.5">Waist</th>
                <th className="py-2.5">Hip</th>
              </tr>
            </thead>
            <tbody>
              {DEFAULT_CHART.map((row) => (
                <tr key={row.size} className="border-b border-grey-light last:border-0">
                  <td className="py-2.5 font-medium">{row.size}</td>
                  <td className="py-2.5">{row.chest}</td>
                  <td className="py-2.5">{row.waist}</td>
                  <td className="py-2.5">{row.hip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </Modal>
  );
}
