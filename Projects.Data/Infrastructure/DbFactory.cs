using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Projects.Data.Infrastructure
{
    public class DbFactory : Disposable, IDbFactory
    {
        DBConnect dbContext;

        public DBConnect Init()
        {
            return dbContext ?? (dbContext = new DBConnect());
        }

        protected override void DisposeCore()
        {
            if (dbContext != null)
                dbContext.Dispose();
        }
    }
}
