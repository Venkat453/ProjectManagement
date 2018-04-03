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
    public class ApiControllerBaseExtended : ApiController
    {
        protected List<Type> _requiredRepositories;

        protected readonly IDataRepositoryFactory _dataRepositoryFactory;
        protected IEntityBaseRepository<tbl_error> _errorsRepository;
        protected IUnitOfWork _unitOfWork;

        private HttpRequestMessage RequestMessage;

        public ApiControllerBaseExtended(IDataRepositoryFactory dataRepositoryFactory, IUnitOfWork unitOfWork)
        {
            _dataRepositoryFactory = dataRepositoryFactory;
            _unitOfWork = unitOfWork;
        }

        protected HttpResponseMessage CreateHttpResponse(HttpRequestMessage request, List<Type> repos, Func<HttpResponseMessage> function)
        {
            HttpResponseMessage response = null;

            try
            {
                RequestMessage = request;
                InitRepositories(repos);
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
        
        private void InitRepositories(List<Type> entities)
        {
            _errorsRepository = _dataRepositoryFactory.GetDataRepository<tbl_error>(RequestMessage);
         
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