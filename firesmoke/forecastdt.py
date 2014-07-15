# functions that provide forecast menu date select options without cluttering up view code
def find_opts_year():
	return (
        ('2010', '2010'), ('2011', '2011'), ('2012', '2012'),
        ('2013', '2013'), ('2014', '2014')
        )

def find_opts_month():
	return (
        ('jan', 'Jan'), ('feb', 'Feb'), ('mar', 'Mar'), ('apr', 'Apr'), ('may', 'May'), ('jun', 'Jun'),
        ('jul', 'Jul'), ('aug', 'Aug'), ('sep', 'Sep'), ('oct', 'Oct'), ('nov', 'Nov'), ('dec', 'Dec')
        )
def find_opts_day():
	return (
        ('1','1'), ('2','2'), ('3','3'), ('4','4'), ('5','5'), ('6','6'), ('7','7'), ('8','8'),
        ('9','9'), ('10','10'), ('11','11'), ('12','12'), ('13','13'), ('14','14'), ('15','15'), ('16','16'),
        ('17','17'), ('18','18'), ('19','19'), ('20','20'), ('21','21'), ('22','22'), ('23','23'), ('24','24'),
        ('25','25'), ('26','26'), ('27','27'), ('28','28'), ('29','29'), ('30','30'), ('31','31')
        )
def find_opts_hour():
	return (
        ('00', '00'),
        ('12', '12')
        )
def find_opts_timezone():
	return (
        ('UTC','UTC'), ('PST','PST'), ('MST','MST'), ('CST','CST'),
        ('EST','EST'), ('AST','AST'), ('NST','NST')
        )

# forecast_datetime = datetime(year=year, m=m, day=day, hours=hour, tzinfo=tz)
def month_str2num(m):
    if m == 'jan':
        return '01'
    elif m =='feb':
        return '02'
    elif m == 'mar':
        return '03'
    elif m == 'apr':
        return '04'
    elif m == 'may':
        return '05'
    elif m == 'jun':
        return '06'
    elif m == 'jul':
        return '07'
    elif m == 'aug':
        return '08'
    elif m == 'sep':
        return '09'
    elif m == 'oct':
        return '10'
    elif m == 'nov':
        return '11'
    elif m == 'dec':
        return '12'