using Dapper;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace OlivePlatform.Infrastructure
{
    public class JsonObjectTypeHandler<T> : SqlMapper.TypeHandler<T>
     where T : class
    {
        public override void SetValue(IDbDataParameter parameter, T? value)
        {
            parameter.Value = value == null
                                  ? DBNull.Value
                                  : JsonConvert.SerializeObject(value);
            parameter.DbType = DbType.String;
        }

        public override T Parse(object value) => JsonConvert.DeserializeObject<T>(value.ToString());
    }
}
