import { useEffect, useState } from 'react'
import { fetchIds, fetchProducts } from './utils/api'
import { Product } from './types'

const PER_PAGE = 50

const App = () => {
  const [page, setPage] = useState(1)
  const [products, setProducts] = useState<Product[]>([])
  const [filter, setFilter] = useState<string | null>(null)
  const [filterValue, setFilterValue] = useState<number | string | null>(null)

  const onFilter = (field: typeof filter, value: typeof filterValue) => {
    setFilter(field)
    setFilterValue(value)
  }

  const onFilterClear = () => {
    setFilter(null)
    setFilterValue(null)
  }

  useEffect(() => {
    fetchIds({
      offset: (page - 1) * PER_PAGE,
      limit: PER_PAGE,
      filter,
      filterValue,
    })
      .then((ids) => fetchProducts({ ids }))
      .then((data) => {
        setProducts(data)
        window.scrollTo(0, 0)
      })
      .catch((err) => {
        console.log(err.response.data)
        alert('Что-то пошло не так.')
      })
  }, [page, filter])

  const filteredProducts = [
    ...new Map(products.map((product) => [product.id, product])).values(),
  ]

  return (
    <div className='w-screen min-h-screen overflow-hidden flex justify-center flex-col items-center py-16 px-12'>
      <table className='border border-black flex-1 overflow-hidden'>
        <thead>
          <tr>
            <td className='px-4 py-2'>ID</td>
            <td className='px-4 py-2'>Продукт</td>
            <td className='px-4 py-2' onClick={() => setFilter('brand')}>
              Бренд
            </td>
            <td className='px-4 py-2' onClick={() => setFilter('price')}>
              Цена
            </td>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length === 0 && (
            <tr className='text-5xl'>
              <p className='py-8 px-6'>Ничего не найдено</p>
            </tr>
          )}
          {filteredProducts.map((product, index) => (
            <tr key={index}>
              <td className='px-4 py-2'>{product.id}</td>
              <td
                className='px-4 py-2'
                onClick={() => onFilter('product', product.product)}
              >
                {product.product}
              </td>
              <td
                className='px-4 py-2'
                onClick={() => onFilter('brand', product.brand)}
              >
                {product.brand}
              </td>
              <td
                className='px-4 py-2'
                onClick={() => onFilter('price', product.price)}
              >
                {product.price}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='flex gap-8'>
        <div className='py-8 gap-4 flex'>
          <button
            onClick={() => setPage(page <= 2 ? 1 : page - 1)}
            disabled={page <= 2}
          >
            Назад
          </button>
          <p>{page}</p>
          <button onClick={() => setPage(page + 1)}>Вперед</button>
        </div>
        <button onClick={onFilterClear}>Очистить фильтры</button>
      </div>
    </div>
  )
}

export default App
