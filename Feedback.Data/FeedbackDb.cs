using System;
using MySql.Data.MySqlClient;

public class FeedbackDb : IDisposable
{
    public readonly MySqlConnection Connection;

    public FeedbackDb()
    {
        Connection = new MySqlConnection("host=35.185.250.150;port=3306;user id=root;password=friendsbecomefamily;database=feedback;");
    }

    public void Dispose()
    {
        Connection.Close();
    }
}

