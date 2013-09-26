<?php
include_once "ez_sql_core.php";
include_once "ez_sql_mysql.php";

class DB
{
	private $db;

	function __construct()
	{
	    $url=parse_url(getenv("CLEARDB_DATABASE_URL"));
	    $server = $url["host"];
	    $username = $url["user"];
	    $password = $url["pass"];
	    $dbname = substr($url["path"],1);
		// Initialise singleton
		$this->db = new ezSQL_mysql($username, $password, $dbname, $server);
		// Cache expiry
		$this->db->cache_timeout = 24; // Note: this is hours
		// Specify a cache dir. Path is taken from calling script
		$this->db->cache_dir = 'ezsql_cache';
	}

	function isExistUser($uid)
	{
		$query = "SELECT * FROM User WHERE uid = {$uid}";
		$user = $this->db->get_row($query);
		return $user;
	}

	function getUser($uid)
	{
		$query = "SELECT * FROM User WHERE uid = {$uid}";
		$user = $this->db->get_row($query);
		return $user;
	}

	function insertNewUser($user)
	{
		if($this->getUser($user['uid']) == null)
		{
			$query = "INSERT INTO user
						(
							'uid',
							'username',
							'first_name',
							'last_name',
							'name',
							'locale',
							'political',
							'birthday_date',
							'books',
							'contact_email',
							'email',
							'friend_count',
							'quotes',
							'relationship_status',
							'religion',
							'sex'
						)
						VALUES
						(
							{$user['uid']},
							{$user['username']},
							{$user['first_name']},
							{$user['last_name']},
							{$user['name']},
							{$user['locale']},
							{$user['political']},
							{$user['birthday_date']},
							{$user['books']},
							{$user['contact_email']},
							{$user['email']},
							{$user['friend_count']},
							{$user['quotes']},
							{$user['relationship_status']},
							{$user['religion']},
							{$user['sex']},
						);";
			$this->db->query($query);
		}
	}
}

