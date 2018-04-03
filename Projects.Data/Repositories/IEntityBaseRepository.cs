using Projects.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Projects.Data.Repositories
{
    //public interface IEntityBaseRepository { }

    public interface IEntityBaseRepository<T>  where T : class, IEntityBase, new()
    {
        IQueryable<T> AllIncluding(params Expression<Func<T, object>>[] includeProperties);
        IQueryable<T> All { get; }
        IQueryable<T> GetAll();
        //IQueryable<T> GetAllBy(Expression<Func<T, bool>> predicate);
        T GetSingle(int id);
        IQueryable<T> FindBy(Expression<Func<T, bool>> predicate);
        void Add(T entity);
        void Delete(T entity);
        void Edit(T entity);

        void Update(T entity, params Expression<Func<T, object>>[] updatedProperties);
    }
}
