using Dapper;
using Newtonsoft.Json;
using System.Data;

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

        public override T Parse(object value)
        {
            if (value == null || value == DBNull.Value)
                return null!;

            // Déjà un objet du bon type
            if (value is T typedValue)
                return typedValue;

            // Sinon on considère que c'est du JSON
            return JsonConvert.DeserializeObject<T>(
                value.ToString()!
            )!;
        }
    }
}