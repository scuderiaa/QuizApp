package com.quizapp.quiz_app.config;

import org.hibernate.community.dialect.SQLiteDialect;
import org.hibernate.dialect.DatabaseVersion;

public class CustomSQLiteDialect extends SQLiteDialect {
    public CustomSQLiteDialect() {
        super(DatabaseVersion.make(3, 0));
    }
}