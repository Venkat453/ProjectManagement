using Projects.Data.Infrastructure;
using Projects.Data.Repositories;
using Projects.Entities;
using Projects.Entities.Membership;
using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using Projects.Web.Infrastructure.Extensions;

namespace Projects.Web.Infrastructure.Core
{
    public class ApiControllerBase : ApiController
    {
        protected readonly IEntityBaseRepository<tbl_error> _errorsRepository;
        protected readonly IUnitOfWork _unitOfWork;

        public ApiControllerBase(IEntityBaseRepository<tbl_error> errorsRepository, IUnitOfWork unitOfWork)
        {
            _errorsRepository = errorsRepository;
            _unitOfWork = unitOfWork;
        }

        public ApiControllerBase(IDataRepositoryFactory dataRepositoryFactory, IEntityBaseRepository<tbl_error> errorsRepository, IUnitOfWork unitOfWork)
        {
            _errorsRepository = errorsRepository;
            _unitOfWork = unitOfWork;
        }

        protected HttpResponseMessage CreateHttpResponse(HttpRequestMessage request, Func<HttpResponseMessage> function)
        {
            HttpResponseMessage response = null;

            try
            {
                response = function.Invoke();
            }
            catch (DbUpdateException ex)
            {
                LogError(ex);
                response = request.CreateResponse(HttpStatusCode.BadRequest, ex.InnerException.Message);
            }
            catch (Exception ex)
            {
                LogError(ex);
                response = request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }

            return response;
        }
        private void LogError(Exception ex)
        {
            try
            {
                tbl_error _error = new tbl_error()
                {
                    tenant_key = Controllers.GlobalVars.gvTenantKey,
                    user_id = Controllers.GlobalVars.gvUserID,
                    message = ex.Message,
                    stacktrace = ex.StackTrace,
                    date_Created = DateTime.Now
                };

                _errorsRepository.Add(_error);
                _unitOfWork.Commit();
            }
            catch { }
        }
    }
}